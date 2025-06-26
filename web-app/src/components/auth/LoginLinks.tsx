
import { Link } from 'react-router-dom'

const LoginLinks = () => {
  return (
    <div className='space-y-4 pt-4 border-t border-gray-200'>
      <div className='text-center'>
        <Link 
          to='/forgot-password' 
          className='text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-all duration-200'
        >
          Forgot your password?
        </Link>
      </div>
      <div className='text-center text-gray-600 text-sm'>
        Don't have an account?{' '}
        <Link 
          to='/register' 
          className='text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all duration-200'
        >
          Sign up here
        </Link>
      </div>
    </div>
  )
}

export default LoginLinks
