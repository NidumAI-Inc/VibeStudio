import type { Context } from 'hono'
import 'dotenv/config'

import { comparePasswords, hashPassword } from '../utils/password.js'
import { checkUserInNidum } from '../utils/check-user-in-nidum.js'
import { validateEmail } from '../utils/common.js'
import { getToken } from '../utils/get-token.js'
import generateOtp from '../utils/generate-otp.js'
import transporter from '../utils/transporter.js'

import { forgetPassTemp, registerOtp, welcome } from '../mail-templates/index.js'
import User from '../models/user.js'

export async function getUserInfo(c: Context) {
  const { _id } = c.get('user')

  const invites = await User.findOne({ _id }).select('-password').lean()
  return c.json(invites)
}

export async function register(c: Context) {
  const { email, password, ...rest } = await c.req.json()
  if ((await validateEmail(email)) === false) {
    return c.json({ message: 'Invalid email' }, 400)
  }

  const userExist = await User.findOne({ email })
  if (userExist) return c.json({ message: 'Email is already exists' }, 400)

  if (!password) return c.json({ message: "Password shouldn't be empty" }, 400)

  const hashedPass = await hashPassword(password)

  const user = new User({ email, password: hashedPass, ...rest })

  await user.save()

  await transporter.sendMail({
    to: email,
    from: process.env.GMAIL_ID,
    subject: 'Welcome to Native Node Ecosystem',
    html: welcome(),
  })

  return c.json({ message: 'User Saved successfully' })
}

export async function resendOtp(c: Context) {
  const { email } = await c.req.json()
  if ((await validateEmail(email)) === false) {
    return c.json({ message: 'Invalid email' }, 400)
  }

  const user = await User.findOne({ email })
  if (!user) return c.json({ message: 'User not found' }, 400)

  const verifiyOtp = generateOtp()

  user.verifiyOtp = verifiyOtp

  await transporter.sendMail({
    to: email,
    from: process.env.GMAIL_ID,
    subject: 'Your OTP for Native Node Account',
    html: registerOtp({ otp: verifiyOtp }),
  })

  await user.save()

  return c.json({ message: 'Email otp resend successfully' })
}

export async function verifyOtp(c: Context) {
  const { email, otp } = await c.req.json()
  if ((await validateEmail(email)) === false) {
    return c.json({ message: 'Invalid email' }, 400)
  }

  const user = await User.findOne({ email })
  if (!user) return c.json({ message: 'User not found' }, 400)

  if (Number(otp) !== user.verifiyOtp) return c.json({ message: 'OTP not matched' }, 400)

  user.verified = true
  user.verifiyOtp = undefined
  await user.save()

  return c.json({ message: 'Your email has been successfully verified' })
}

export async function login(c: Context) {
  const { email, password } = await c.req.json()

  if ((await validateEmail(email)) === false) {
    return c.json({ message: 'Invalid email' }, 400)
  }

  const user = await User.findOne({ email })

  if (!user) {
    const result = await checkUserInNidum(email, password)
    const isVerifiedNidumUser = result?.data?.isVerified

    if (result.status === 200 && result.data?._id) {
      const hashedPass = await hashPassword(password)
      const user = new User({ email, password: hashedPass, verified: isVerifiedNidumUser })

      const newToken = await getToken(user._id.toString(), 60 * 60 * 24)
      user.token = user.token.concat(newToken)
      await user.save()

      const payload = {
        _id: user._id,
        token: newToken,
        isVerified: user.verified,
      }

      return c.json(payload)
    }

    return c.json({ message: result.data?.message || 'No user found' }, result.data.status || 401)
  }

  if (!password) {
    return c.json({ message: "Password shouldn't be empty" }, 400)
  }

  const result = await comparePasswords(password, user.password as string)

  if (!result) {
    return c.json({ message: 'Password does not match' }, 401)
  }

  const newToken = await getToken(user._id.toString(), 60 * 60 * 24)
  user.token = user.token.concat(newToken)
  await user.save()

  const payload = {
    _id: user._id,
    token: newToken,
    isVerified: user.verified,
  }

  return c.json(payload)
}

export async function updatePassword(c: Context) {
  const { oldPassword, newPassword } = await c.req.json()
  const { email } = c.get('user')

  const user = await User.findOne({ email })
  if (!user) return c.json({ message: 'User not found' }, 400)

  if (!oldPassword || !newPassword) return c.json({ message: "Passwords shouldn't be empty" }, 400)

  const result = await comparePasswords(oldPassword, user.password as string)
  if (!result) return c.json({ message: 'Password does not match' }, 401)

  const hashedPass = await hashPassword(newPassword)
  user.password = hashedPass
  await user.save()

  return c.json({ message: 'Password updated successfully' })
}

export async function forgetPass(c: Context) {
  const { email } = await c.req.json()
  if ((await validateEmail(email)) === false) {
    return c.json({ message: 'Invalid email' }, 400)
  }

  const user = await User.findOne({ email })
  if (!user) return c.json({ message: 'User not found' }, 400)

  const verifiyOtp = generateOtp()

  user.verifiyOtp = verifiyOtp

  await transporter.sendMail({
    to: email,
    from: process.env.GMAIL_ID,
    subject: 'Reset password key',
    html: forgetPassTemp(verifiyOtp),
  })

  await user.save()

  return c.json({ message: 'Passkey sent to email successfully' })
}

export async function resetPass(c: Context) {
  const { email, password, otp } = await c.req.json()
  if ((await validateEmail(email)) === false) {
    return c.json({ message: 'Invalid email' }, 400)
  }

  const user = await User.findOne({ email })
  if (!user) return c.json({ message: 'User not found' }, 400)

  if (!password) return c.json({ message: "Password shouldn't be empty" }, 400)

  if (Number(otp) !== user.verifiyOtp) return c.json({ message: 'OTP not matched' }, 400)

  const hashedPass = await hashPassword(password)

  user.password = hashedPass
  user.verifiyOtp = undefined

  await user.save()

  return c.json({ message: 'Password reseted successfully' })
}

export async function updateUser(c: Context) {
  const { _id } = c.get('user')
  const { ...rest } = await c.req.json()

  const allowedFields = ['firstName', 'lastName']
  const updateFields = Object.keys(rest).filter((key) => allowedFields.includes(key))

  const updateData = updateFields.reduce((obj, key) => {
    obj[key] = rest[key]
    return obj
  }, {} as Record<string, any>)

  await User.updateOne({ _id }, { $set: updateData })
  return c.json({ message: 'User details updated successfully' })
}

export async function deleteAccount(c: Context) {
  const { email, _id } = c.get('user')

  const user = await User.findOne({ email }).lean()
  if (!user) return c.json({ message: 'User not found' }, 400)

  await User.findOneAndDelete({ _id })

  return c.json({ message: 'User account deleted successfully' })
}

export async function logout(c: Context) {
  const { _id } = c.get('user')
  const token = c.get('token')

  const payload: any = { token }

  await User.updateOne(
    { _id },
    {
      $pull: payload,
    }
  )
  return c.json({ message: 'User Logged Out successfully' })
}
