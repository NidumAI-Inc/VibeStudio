
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import LoginForm from './LoginForm'
import LoginLinks from './LoginLinks'

interface LoginCardProps {
  formData: {
    email: string
    password: string
  }
  isLoading: boolean
  onSubmit: (e: React.FormEvent) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const LoginCard = ({ formData, isLoading, onSubmit, onChange }: LoginCardProps) => {
  return (
    <Card className='bg-white/80 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 animate-scale-in'>
      <CardHeader className='space-y-2 pb-6'>
        <CardTitle className='text-2xl font-bold text-center bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
          Sign In
        </CardTitle>
        <CardDescription className='text-center text-gray-600 text-base'>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <LoginForm 
          formData={formData}
          isLoading={isLoading}
          onSubmit={onSubmit}
          onChange={onChange}
        />
        <LoginLinks />
      </CardContent>
    </Card>
  )
}

export default LoginCard
