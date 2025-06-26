import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { useFogetPassMutate } from '@/hooks/use-user'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import AuthWrapper from '@/components/auth-wrapper'

function ForgetPass() {
  const { register, formState: { errors, isSubmitting }, handleSubmit } = useForm({
    defaultValues: {
      email: '',
    },
  })

  const { isPending, mutate } = useFogetPassMutate()

  function onSubmit(data: { email: string }) {
    mutate(data?.email?.toLowerCase()?.trim())
  }

  return (
    <AuthWrapper
      title='Forgot Password'
      description='Enter your email to reset your password'
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

          {errors.email && <div className='mt-0.5 text-xs text-red-600'>{errors.email.message}</div>}
        </div>

        <Button
          type='submit'
          className='w-full bg-primary hover:bg-primary/90'
          disabled={isPending || isSubmitting}>
          Submit
        </Button>

        <p className='text-center text-sm text-muted-foreground'>
          Remember your login credentials?{' '}
          <Button variant='link' className='p-0 text-primary' asChild>
            <Link to='/login'>Login</Link>
          </Button>
        </p>
      </form>
    </AuthWrapper>
  )
}

export default ForgetPass
