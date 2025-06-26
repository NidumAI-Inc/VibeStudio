import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { useResetPassMutate } from '@/hooks/use-user'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import AuthWrapper from '@/components/auth-wrapper'

type FormValues = {
  otp: number
  email: string
  password: string
}

function ResetPass() {
  const [showPass, setShowPass] = useState(false)

  const { register, formState: { errors, isSubmitting }, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      otp: undefined,
      email: '',
      password: '',
    },
  })

  const { isPending, mutate } = useResetPassMutate()

  const updateShowPass = () => setShowPass((p) => !p)

  function onSubmit(data: FormValues) {
    mutate({ ...data, email: data.email?.toLowerCase()?.trim() })
  }

  return (
    <AuthWrapper
      title='Reset Password'
      description='Enter your details to reset your password'
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <label className='text-sm font-medium' htmlFor='email'>
            Email
          </label>

          <Input
            id='email'
            type='email'
            placeholder='Enter your email'
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Enter a valid email',
              },
            })}
          />

          {errors.email && <div className='mt-0.5 text-xs text-red-400'>{errors.email.message}</div>}
        </div>

        <div>
          <label className='text-sm font-medium' htmlFor='password'>
            Password
          </label>

          <div className='relative'>
            <Input
              id='password'
              type={showPass ? 'text' : 'password'}
              placeholder='Enter your password'
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long',
                },
              })}
            />

            <button
              onClick={updateShowPass}
              className='px-0 absolute top-2.5 right-2 opacity-60 hover:opacity-80 cursor-pointer'
              type='button'>
              {showPass ? <Eye className='size-4' /> : <EyeOff className='size-4' />}
            </button>
          </div>

          {errors.password && <div className='mt-0.5 text-xs text-red-400'>{errors.password.message}</div>}
        </div>

        <div>
          <label className='text-sm font-medium' htmlFor='otp'>
            OTP
          </label>

          <Input
            id='otp'
            type='number'
            placeholder='Enter your OTP'
            {...register('otp', {
              required: 'OTP is required',
            })}
          />

          {errors.otp && <div className='mt-0.5 text-xs text-red-400'>{errors.otp.message}</div>}
        </div>

        <Button
          type='submit'
          className='w-full bg-primary hover:bg-primary/90'
          disabled={isPending || isSubmitting}>
          Confirm
        </Button>
      </form>
    </AuthWrapper>
  )
}

export default ResetPass
