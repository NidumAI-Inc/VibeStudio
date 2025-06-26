import { sign } from "hono/jwt";
import 'dotenv/config';

export async function getToken(_id: string, expiresIn?: number) {
  const payload = {
    _id,
    exp: Math.floor(Date.now() / 1000) + (expiresIn || 60 * 60 * 24 * 14),
  }
  const secret = process.env.JWT_SECRET || ""
  const newToken = await sign(payload, secret)
  return newToken
}

export async function getRefreshToken(_id: string, expiresIn?: number) {
  const payload = {
    _id,
    exp: Math.floor(Date.now() / 1000) + (expiresIn || 60 * 60 * 24 * 14),
  }
  const secret = process.env.REFRESH_SECRET || ""
  const newToken = await sign(payload, secret)
  return newToken
}
