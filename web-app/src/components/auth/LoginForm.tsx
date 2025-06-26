
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight } from 'lucide-react'

interface LoginFormProps {
  formData: {
    email: string
    password: string
  }
  isLoading: boolean
  onSubmit: (e: React.FormEvent) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const LoginForm = ({ formData, isLoading, onSubmit, onChange }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      {/* Email field */}
      <div className='space-y-2'>
        <Label htmlFor='email' className='text-gray-700 font-medium flex items-center gap-2'>
          <Mail className='w-4 h-4 text-blue-500' />
          Email Address
        </Label>
        <div className='relative group'>
          <Input
            id='email'
            name='email'
            type='email'
            placeholder='Enter your email'
            value={formData.email}
            onChange={onChange}
            required
            className='bg-white/50 border-2 border-gray-200 text-gray-800 pl-4 pr-4 py-3 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 group-hover:border-blue-300'
          />
        </div>
      </div>

      {/* Password field */}
      <div className='space-y-2'>
        <Label htmlFor='password' className='text-gray-700 font-medium flex items-center gap-2'>
          <Lock className='w-4 h-4 text-blue-500' />
          Password
        </Label>
        <div className='relative group'>
          <Input
            id='password'
            name='password'
            type={showPassword ? 'text' : 'password'}
            placeholder='Enter your password'
            value={formData.password}
            onChange={onChange}
            required
            className='bg-white/50 border-2 border-gray-200 text-gray-800 pl-4 pr-12 py-3 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 group-hover:border-blue-300'
          />
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200'
            onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
          </Button>
        </div>
      </div>

      {/* Submit button */}
      <Button 
        type='submit' 
        className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 group' 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className='mr-2 h-5 w-5 animate-spin' />
            Signing in...
          </>
        ) : (
          <>
            Sign In
            <ArrowRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200' />
          </>
        )}
      </Button>
    </form>
  )
}

export default LoginForm
