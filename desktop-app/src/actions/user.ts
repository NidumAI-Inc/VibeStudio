import { endPoints } from '../services/end-points'
import sendApiReq from '../services/send-api-req'

type loginT = { email: string; password: string }
export function login(data: loginT) {
  return sendApiReq({
    isAuthendicated: false,
    method: 'post',
    url: endPoints.login,
    data,
  })
}

export type verifyOtpT = { email: string; otp: number }
export function verifyOtp(data: verifyOtpT) {
  return sendApiReq({
    isAuthendicated: false,
    method: 'post',
    url: endPoints.verifyOtp,
    data,
  })
}

export function resendOtp(email: string) {
  return sendApiReq({
    isAuthendicated: false,
    method: 'post',
    url: endPoints.resendOtp,
    data: { email },
  })
}

export function signup(data: any) {
  return sendApiReq({
    isAuthendicated: false,
    method: 'post',
    url: endPoints.register,
    data,
  })
}

export function logout() {
  return sendApiReq({
    method: 'post',
    url: endPoints.logout,
    data: {},
  })
}

type updatePassT = { oldPassword: string; newPassword: string }
export function updatePass(data: updatePassT) {
  return sendApiReq({
    method: 'put',
    url: endPoints.updatePass,
    data,
  })
}

export function forgetPass(email: string) {
  return sendApiReq({
    isAuthendicated: false,
    method: 'post',
    url: endPoints.forgetPass,
    data: { email },
  })
}

type resetPassT = { email: string; password: string; otp: number }
export function resetPass(data: resetPassT) {
  return sendApiReq({
    isAuthendicated: false,
    method: 'post',
    url: endPoints.resetPass,
    data,
  })
}

export function confirmDeleteAccount() {
  return sendApiReq({
    method: 'delete',
    url: endPoints.deleteAccount,
    data: {},
  })
}
