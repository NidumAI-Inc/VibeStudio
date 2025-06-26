import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import {
  confirmDeleteAccount,
  forgetPass,
  login,
  logout,
  resendOtp,
  resetPass,
  signup,
  updatePass,
  verifyOtp,
} from '../actions/user'

import useAuthStore from '../store/auth'

export function useSignupMutate() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: signup,
    onSuccess() {
      toast.success('Account created successfully')
      navigate('/login')
    },
    onError(error) {
      let hasError = error?.message
      toast.error(hasError || 'An error occurred. Please try again.')
    },
  })
}

export function useSendOTP() {
  return useMutation({
    mutationFn: resendOtp,
    onSuccess() {
      toast.success('OTP has been sent successfully. Please check your email.')
    },
    onError(error) {
      let hasError = error?.message
      toast.error(hasError || 'An error occurred. Please try again.')
    },
  })
}

export function useVerifyEmail() {
  // const updateAuth = useAuthStore((s) => s.update)

  return useMutation({
    mutationFn: verifyOtp,
    onSuccess() {
      // updateAuth({ isVerified: true })
      toast.success('Account verified successfully')
    },
    onError(error) {
      let hasError = error?.message
      toast.error(hasError || 'An error occurred. Please try again.')
    },
  })
}

export function useLoginMutate() {
  const updateAuth = useAuthStore((s) => s.update)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: login,
    onSuccess(res, variables) {
      updateAuth({
        ...res,
        email: variables?.email,
        isLoggedIn: true,
      })

      navigate('/', { replace: true })
      toast.success('Successfully logged in.')
    },
    onError(err) {
      let hasError = err?.message
      toast.error(hasError || 'An error occurred. Please try again.')
    },
  })
}

export function useUpdatePassMutate() {
  return useMutation({
    mutationFn: updatePass,
    onSuccess() {
      toast.success('Password updated successfully')
    },
    onError(err) {
      let hasError = err?.message
      toast.error(hasError || 'An error occurred. Please try again.')
    },
  })
}

export function useFogetPassMutate() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: forgetPass,
    onSuccess() {
      navigate('/reset-pass')
      toast.success('Check your email to retrieve the OTP.')
    },
    onError(err) {
      let hasError = err?.message
      toast.error(hasError || 'An error occurred. Please try again.')
    },
  })
}

export function useResetPassMutate() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: resetPass,
    onSuccess() {
      navigate('/login')
      toast.success('Password updated successfully')
    },
    onError(err) {
      let hasError = err?.message
      toast.error(hasError || 'An error occurred. Please try again.')
    },
  })
}

export function useLogoutMutate() {
  const clearAuth = useAuthStore((s) => s.clear)

  function onClear() {
    clearAuth()
    toast.success('Successfully logged out.')
  }

  return useMutation({
    mutationFn: logout,
    onSuccess() {
      onClear()
    },
    onError() {
      onClear()
    },
  })
}

export function useSendOTPMutate() {
  return useMutation({
    mutationFn: resendOtp,
    onSuccess() {
      toast.success('OTP has been sent successfully. Please check your email.')
    },
    onError(error) {
      let hasError = error?.message
      toast.error(hasError || 'An error occurred. Please try again.')
    },
  })
}

export function useAccountDeleteConfirmMutate() {
  return useMutation({
    mutationFn: confirmDeleteAccount,
    onSuccess() {
      toast.success('Account deleted successfully')
    },
    onError(err) {
      let hasError = err?.message
      toast.error(hasError || 'An error occurred. Please try again.')
    },
  })
}

export function useGoogleAuthMutate() {
  const updateAuth = useAuthStore(s => s.update)

  const navigate = useNavigate()

  return useMutation({
    mutationFn: window?.electronAPI?.googleAuth,
    onSuccess(res: any) {
      if (res?.error || !res?.token) {
        toast.error(res?.message || "Something went wrong!!!")

      } else {
        updateAuth({
          _id: res?._id,
          email: res?.email,
          token: res?.token,
          isLoggedIn: true,
          isGoogleAuth: true,
        })

        navigate('/', { replace: true })
        toast.success("User loggedin successfully")
      }
    },
    onError(err) {
      let hasError = err?.message
      if (hasError?.endsWith("prematurely")) return
      if (hasError) {
        toast.error(hasError)
      } else {
        toast.error("Something went wrong!!!")
      }
    }
  })
}
