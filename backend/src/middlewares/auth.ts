import { createMiddleware } from 'hono/factory';
import { verify } from 'hono/jwt';
import 'dotenv/config';

import User from '../models/user.js';

export const authMiddleware = createMiddleware(async (c, next) => {
  try {
    const token = c.req.header("Authorization")?.replace('Bearer ', '');
    if (!token) return c.json({ error: 'No token provided' }, 400);

    const authData = await authCheck(token);

    if (!authData.user) return c.json({ error: 'User not found' }, 400);
    if (authData.tokenIndex === -1) return c.json({ error: 'Invalid token' }, 401)

    c.set("user", authData.user)
    c.set("token", token)

    await next()
  } catch (err: any) {
    if (err?.message.includes("expired")) {
      return c.json({ error: 'Token expired' }, 401);
    }
    return c.json({ error: 'Invalid token' }, 400)
  }
})

export const authCheck = async (token: string) => {
  let authData: any = {
    user: null,
    tokenIndex: -1
  }
  const payload = await verify(token, process.env.JWT_SECRET || "")
  const _id = payload._id

  authData.user = await User.findById(_id).select("-password -__v").lean();
  if (!authData.user) return authData

  authData.tokenIndex = authData.user.token.indexOf(token);

  return authData;
}
