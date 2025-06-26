
import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/hooks/use-toast'
import LoginBackground from '@/components/auth/LoginBackground'
import LoginHeader from '@/components/auth/LoginHeader'
import LoginCard from '@/components/auth/LoginCard'

const Login = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  if (isAuthenticated) {
    return <Navigate to='/dashboard' replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await login(formData.email, formData.password)

      if (response.token) {
        toast({
          title: 'Success',
          description: 'Logged in successfully!',
        })
        navigate('/dashboard')
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Login failed',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4 relative overflow-hidden'>
      <LoginBackground />
      
      <div className='w-full max-w-md relative z-10'>
        <LoginHeader />
        <LoginCard 
          formData={formData}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}

export default Login
