import { Badge } from '@/components/ui/badge'
import { Zap } from 'lucide-react'

const LogoSection = () => {
  return (
    <div className='flex items-center space-x-2'>
      <img
        src='/lovable-uploads/3e8e3e70-c61d-4649-b12d-ba1c2fbd0440.png'
        alt='VibeStudio AI Logo'
        className='w-8 h-8'
      />
      <span className='text-2xl font-bold text-black'>VibeStudio AI</span>
      <Badge variant='secondary' className='text-xs bg-blue-500 text-white'>
        <Zap className='w-3 h-3 mr-1' />
        BETA
      </Badge>
    </div>
  )
}

export default LogoSection
