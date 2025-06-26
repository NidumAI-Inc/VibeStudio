
const LoginBackground = () => {
  return (
    <div className='absolute inset-0 overflow-hidden'>
      <div className='absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob'></div>
      <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob-delay-2'></div>
      <div className='absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob-delay-4'></div>
    </div>
  )
}

export default LoginBackground
