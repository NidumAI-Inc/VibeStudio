const LoginHeader = () => {
  return (
    <div className='text-center mb-8 animate-fade-in'>
      <div className='flex items-center justify-center space-x-3 mb-6'>
        <div className='relative'>
          <img
            src='/lovable-uploads/3e8e3e70-c61d-4649-b12d-ba1c2fbd0440.png'
            alt='VibeStudio Logo'
            className='w-12 h-12 drop-shadow-lg hover:scale-110 transition-transform duration-300'
          />
          <div className='absolute inset-0 bg-blue-500 rounded-full opacity-20 blur animate-pulse'></div>
        </div>
        <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
          VibeStudio
        </h1>
      </div>
      <p className='text-gray-600 text-lg font-medium'>Welcome back to your creative workspace</p>
    </div>
  )
}
export default LoginHeader
