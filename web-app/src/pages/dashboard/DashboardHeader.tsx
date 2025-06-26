import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Zap, LayoutDashboard, Settings, User, Menu } from 'lucide-react'

interface DashboardHeaderProps {
  activeView: 'overview' | 'settings' | 'account'
  selectedProject: any | null
  onViewChange: (view: 'overview' | 'settings' | 'account') => void
  onProjectNameUpdate: () => void
}

const DashboardHeader = ({ activeView, selectedProject, onViewChange, onProjectNameUpdate }: DashboardHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className='w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75'>
      <div className='w-full px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center space-x-6 flex-shrink-0'>
            <div className='flex items-center space-x-2'>
              <div className='p-2 rounded-lg bg-blue-50'>
                <img
                  src='/lovable-uploads/3e8e3e70-c61d-4649-b12d-ba1c2fbd0440.png'
                  alt='VibeStudio AI Logo'
                  className='w-6 h-6'
                />
              </div>
              <span className='text-2xl font-bold text-blue-500'>VibeStudio AI</span>
              <Badge variant='secondary' className='ml-2 text-xs bg-blue-500 text-white'>
                <Zap className='w-3 h-3 mr-1' />
                BETA
              </Badge>
            </div>

            {selectedProject && (
              <div className='flex items-center space-x-2 text-sm text-gray-600'>
                <span>Project:</span>
                <span className='text-gray-900 font-medium'>{selectedProject.project_name}</span>
              </div>
            )}
          </div>

          <div className='hidden md:flex items-center space-x-4'>
            <Button
              variant={activeView === 'overview' ? 'default' : 'ghost'}
              size='sm'
              onClick={() => onViewChange('overview')}
              className={activeView === 'overview' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-900'}>
              <LayoutDashboard className='w-4 h-4 mr-2' />
              Overview
            </Button>
            <Button
              variant={activeView === 'settings' ? 'default' : 'ghost'}
              size='sm'
              onClick={() => onViewChange('settings')}
              className={activeView === 'settings' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-900'}>
              <Settings className='w-4 h-4 mr-2' />
              Settings
            </Button>
            <Button
              variant={activeView === 'account' ? 'default' : 'ghost'}
              size='sm'
              onClick={() => onViewChange('account')}
              className={activeView === 'account' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-900'}>
              <User className='w-4 h-4 mr-2' />
              Account
            </Button>
          </div>

          <div className='md:hidden'>
            <Button variant='ghost' size='sm' onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className='w-5 h-5' />
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className='md:hidden border-t border-gray-200 py-4'>
            <div className='flex flex-col space-y-2'>
              <Button
                variant={activeView === 'overview' ? 'default' : 'ghost'}
                size='sm'
                onClick={() => {
                  onViewChange('overview')
                  setIsMenuOpen(false)
                }}
                className={`justify-start ${
                  activeView === 'overview' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                <LayoutDashboard className='w-4 h-4 mr-2' />
                Overview
              </Button>
              <Button
                variant={activeView === 'settings' ? 'default' : 'ghost'}
                size='sm'
                onClick={() => {
                  onViewChange('settings')
                  setIsMenuOpen(false)
                }}
                className={`justify-start ${
                  activeView === 'settings' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                <Settings className='w-4 h-4 mr-2' />
                Settings
              </Button>
              <Button
                variant={activeView === 'account' ? 'default' : 'ghost'}
                size='sm'
                onClick={() => {
                  onViewChange('account')
                  setIsMenuOpen(false)
                }}
                className={`justify-start ${
                  activeView === 'account' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                <User className='w-4 h-4 mr-2' />
                Account
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default DashboardHeader
