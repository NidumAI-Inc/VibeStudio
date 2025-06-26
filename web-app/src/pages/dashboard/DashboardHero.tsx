import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, ArrowUp } from 'lucide-react'
import { useState } from 'react'

interface DashboardHeroProps {
  onNewChat: (prompt?: string) => void
}

const DashboardHero = ({ onNewChat }: DashboardHeroProps) => {
  const [prompt, setPrompt] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      // Pass the prompt to create a new project with this initial message
      onNewChat(prompt.trim())
      setPrompt('')
    }
  }

  return (
    <div className='relative min-h-[70vh] flex items-center justify-center'>
      {/* Background gradient */}
      <div className='absolute inset-0 bg-gradient-to-br from-blue-500/10 via-white to-blue-600/5'></div>

      <div className='relative z-10 text-center max-w-4xl mx-auto px-4'>
        <h1 className='text-6xl md:text-7xl font-bold mb-6 text-gray-900'>
          Build something <span className='text-blue-500'>VibeStudio AI</span>
        </h1>

        <p className='text-xl text-gray-600 mb-12 max-w-2xl mx-auto'>Create apps and websites by chatting with AI</p>

        {/* Chat input */}
        <div className='max-w-2xl mx-auto mb-8'>
          <form onSubmit={handleSubmit} className='relative'>
            <div className='glass rounded-2xl p-4 border border-blue-200/50'>
              <div className='flex items-center space-x-3'>
                <Plus className='w-5 h-5 text-blue-400 flex-shrink-0' />
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder='Ask VibeStudio AI to create a portfolio website...'
                  className='flex-1 bg-transparent border-none text-gray-900 placeholder-gray-500 focus:ring-0 text-base'
                />
                <Button
                  type='submit'
                  size='sm'
                  className='bg-blue-500 text-white hover:bg-blue-600 rounded-full w-8 h-8 p-0'
                  disabled={!prompt.trim()}>
                  <ArrowUp className='w-4 h-4' />
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Workspace indicator */}
        <div className='glass rounded-xl p-6 max-w-md mx-auto border border-blue-200/50'>
          <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center'>
              <img
                src='/lovable-uploads/3e8e3e70-c61d-4649-b12d-ba1c2fbd0440.png'
                alt='VibeStudio AI Logo'
                className='w-5 h-5'
              />
            </div>
            <div className='text-left'>
              <h3 className='text-gray-900 font-medium'>VibeStudio AI Workspace</h3>
              <p className='text-gray-600 text-sm'>Your AI development environment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHero
