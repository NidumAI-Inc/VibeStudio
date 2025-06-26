import { Hono } from 'hono'

import { authMiddleware } from '../middlewares/auth.js'
import {
  getUserInfo,
  login,
  logout,
  register,
  resendOtp,
  updateUser,
  verifyOtp,
  deleteAccount,
  forgetPass,
  resetPass,
  updatePassword,
} from '../controllers/user.js'
import { getStreamCost, getUserTotalCost, updatePricing } from '../controllers/pricing.js'
import { getAnthropicApiKey } from '../controllers/api-key.js'

const userRoutes = new Hono()

// public
userRoutes
  .post('/register', register)
  .post('/resend-otp', resendOtp)
  .post('/verify-otp', verifyOtp)
  .post('/forget-pass', forgetPass)
  .post('/reset-pass', resetPass)
  .post('/login', login)

userRoutes.use(authMiddleware)

// private
userRoutes
  .get('/me', getUserInfo)
  .post('/pricing', updatePricing)
  .post('/pricing/total', getUserTotalCost)
  .get('/pricing/stream/:stream_id', getStreamCost)
  .post('/logout', logout)
  .put('/update', updateUser)
  .put('/update-pass', updatePassword)
  .delete('/account', deleteAccount)
  .get('/api-key/anthropic', getAnthropicApiKey)

export default userRoutes
