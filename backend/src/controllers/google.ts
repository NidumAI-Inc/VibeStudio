import { OAuth2RequestError, ArcticFetchError, decodeIdToken, generateState, generateCodeVerifier } from "arctic";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { Context } from "hono";
import 'dotenv/config';

import transporter from "../utils/transporter.js";
import { getToken } from "../utils/get-token.js";
import { welcome } from "../mail-templates/index.js";
import google from "../config/google.js";
import User from "../models/user.js";

type dataT = {
  expiresAt: number
  codeVerifier: string
  redirectUrl?: string
}

const authStates = new Map<string, dataT>()

export async function getGoogleUrl(c: Context) {
  const state = generateState()
  const codeVerifier = generateCodeVerifier()

  const redirectUrl = c.req.query("redirect_url") || ""

  authStates.set(state, {
    expiresAt: Date.now() + 10 * 60 * 1000,
    codeVerifier,
    redirectUrl,
  })

  const url = google.createAuthorizationURL(
    state,
    codeVerifier,
    ["openid", "profile", "email"]
  )

  url.searchParams.set("access_type", "offline")
  url.searchParams.set("prompt", "select_account")
  return c.redirect(url.toString())
}

function msgHlp(c: Context, storedAuth: dataT, msg: Record<string, string | number | boolean>, status: ContentfulStatusCode = 200) {
  if (storedAuth?.redirectUrl) {
    const finalUrl = new URL(storedAuth?.redirectUrl)

    Object.entries(msg).forEach(([key, val]) => {
      finalUrl.searchParams.set(key, `${val}`)
    })

    return c.redirect(finalUrl.toString())
  }

  return c.json(msg, status)
}

export async function googleCallback(c: Context) {
  const code = c.req.query("code")
  const state = c.req.query("state")

  if (!code || !state) {
    return c.json({ message: "Missing code or state" }, 400)
  }

  const storedAuth = authStates.get(state)
  if (!storedAuth || storedAuth.expiresAt < Date.now()) {
    return c.json({ message: "Invalid or expired state" }, 400)
  }

  try {
    const tokens = await google.validateAuthorizationCode(
      code,
      storedAuth.codeVerifier
    )

    authStates.delete(state)

    const idToken = tokens.idToken()
    const claims = decodeIdToken(idToken) as any
    const email = claims?.email

    if (!email) return msgHlp(c, storedAuth, {
      message: "Problem in extracting email id",
      error: true,
    }, 400)

    let user = await User.findOne({ email })

    if (!user) {
      user = new User({
        email,
        firstName: claims?.given_name?.trim(),
        lastName: claims?.family_name?.trim(),
        isGoogleAuth: true,
        verified: true,
      })

      await user.save()

      await transporter.sendMail({
        to: email,
        from: process.env.GMAIL_ID,
        subject: "Welcome to Nidum Decentralized AI Ecosystem",
        html: welcome()
      })
    }

    const newToken = await getToken(user._id.toString(), (60 * 60 * 24))

    user.token = user.token.concat(newToken)
    await user.save()

    return msgHlp(c, storedAuth, {
      token: newToken,
      email,
      _id: user._id?.toString(),
    })

  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      return c.json({ message: "Invalid authorization code" }, 400)
    }
    if (e instanceof ArcticFetchError) {
      return c.json({ message: "Failed to fetch user data" }, 500)
    }
    return c.json({ message: "Authentication failed" }, 500)
  }
}
