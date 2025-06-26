import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Play, Sparkles, Bot, Code, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const navigate = useNavigate()

  return (
    <section className='relative min-h-screen flex items-center justify-center pt-16 overflow-hidden'>
      {/* Background Effects */}
      <div className='absolute inset-0 bg-blue-500/5' />
      <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse' />
      <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000' />

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
        <div className='animate-fade-in'>
          <Badge className='mb-6 px-4 py-2 bg-white/80 border-blue-200 text-black hover:bg-white/90 transition-colors'>
            <Sparkles className='w-4 h-4 mr-2' />
            Powered by Claude AI
          </Badge>

          <h1 className='text-5xl md:text-7xl font-bold mb-6 leading-tight text-black'>
            Build with
            <span className='text-blue-500 block mt-2'>AI-Powered Code</span>
          </h1>

          <p className='text-xl md:text-2xl text-black mb-8 max-w-3xl mx-auto leading-relaxed'>
            VibeStudio AI transforms your ideas into reality with Claude AI. Stream intelligent conversations, manage
            files seamlessly, and deploy to GitHub - all in one powerful platform.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-12'>
            <Button
              size='lg'
              onClick={() => navigate('/dashboard')}
              className='bg-blue-500 text-white hover:bg-blue-600 text-lg px-8 py-6 rounded-xl'>
              <Bot className='w-5 h-5 mr-2' />
              Start Building
              <ArrowRight className='w-5 h-5 ml-2' />
            </Button>

            <Button
              variant='outline'
              size='lg'
              className='border-blue-500 text-black hover:bg-blue-50 text-lg px-8 py-6 rounded-xl'>
              <Play className='w-5 h-5 mr-2' />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-16'>
            <div className='glass p-6 rounded-2xl'>
              <div className='flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mb-4 mx-auto'>
                <Code className='w-6 h-6 text-blue-500' />
              </div>
              <h3 className='text-2xl font-bold mb-2 text-black'>10,000+</h3>
              <p className='text-black'>Projects Created</p>
            </div>

            <div className='glass p-6 rounded-2xl'>
              <div className='flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mb-4 mx-auto'>
                <Zap className='w-6 h-6 text-blue-500' />
              </div>
              <h3 className='text-2xl font-bold mb-2 text-black'>99.9%</h3>
              <p className='text-black'>Uptime</p>
            </div>

            <div className='glass p-6 rounded-2xl'>
              <div className='flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mb-4 mx-auto'>
                <Bot className='w-6 h-6 text-blue-500' />
              </div>
              <h3 className='text-2xl font-bold mb-2 text-black'>50M+</h3>
              <p className='text-black'>AI Responses</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
