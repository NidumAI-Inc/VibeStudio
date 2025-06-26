import { CheckCircle, Loader, AlertCircle, Moon, Sun } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useVibeAutoSetup } from '@/hooks/use-vibe-auto-setup'
import useVMStore from '@/store/vm'
import { useTheme } from '@/components/common/theme-provider'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function VibeSetupPage() {
  const { setupPhase, setupProgress, vibeVmId } = useVibeAutoSetup()
  const navigate = useNavigate()
  const vms = useVMStore((s) => s.vms)
  const { theme, toggleTheme } = useTheme()
  
  // If user navigates back to setup page but VM is already ready, redirect them
  useEffect(() => {
    const existingVibeVM = vms.find(vm => vm.type === 'VibeCoding' && vm.downloaded)
    if (existingVibeVM && setupPhase === 'checking') {
      navigate(`/vm/${existingVibeVM.id}`, { replace: true })
    }
  }, [vms, setupPhase, navigate])

  const getPhaseConfig = () => {
    switch (setupPhase) {
      case 'checking':
        return {
          icon: <Loader className="h-8 w-8 animate-spin text-blue-500" />,
          title: 'Checking System',
          description: 'Verifying VibeStudio server configuration...',
          color: 'bg-blue-500',
        }
      case 'downloading':
        return {
          icon: <div className="h-8 w-8 flex items-center justify-center text-orange-500 font-bold text-lg">{Math.round(setupProgress)}%</div>,
          title: 'Downloading VibeStudio Server',
          description: 'Setting up your development environment...',
          color: 'bg-orange-500',
        }
      case 'complete':
        return {
          icon: <CheckCircle className="h-8 w-8 text-green-500" />,
          title: 'Setup Complete',
          description: 'Redirecting to your VibeStudio server...',
          color: 'bg-green-500',
        }
      case 'error':
        return {
          icon: <AlertCircle className="h-8 w-8 text-red-500" />,
          title: 'Setup Failed',
          description: 'There was an error downloading or setting up your server. Please check your internet connection and try again.',
          color: 'bg-red-500',
        }
      default:
        return {
          icon: <Loader className="h-8 w-8 animate-spin text-blue-500" />,
          title: 'Initializing',
          description: 'Please wait...',
          color: 'bg-blue-500',
        }
    }
  }

  const phaseConfig = getPhaseConfig()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex flex-col">
      {/* Simple header with theme toggle */}
      <div className="absolute top-4 right-4">
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleTheme}
          className="rounded-full"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            {phaseConfig.icon}
          </div>
          <CardTitle className="text-xl font-semibold">
            {phaseConfig.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            {phaseConfig.description}
          </p>
          
          {setupPhase === 'downloading' && (
            <div className="space-y-2">
              <Progress value={setupProgress} className="w-full" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Downloading disk image...</span>
                <span>{Math.round(setupProgress)}%</span>
              </div>
            </div>
          )}
          
          {setupPhase === 'complete' && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Setup successful!</span>
              </div>
              <div className="flex justify-center">
                <button 
                  onClick={() => {
                    const vmId = vibeVmId || vms.find(vm => vm.type === 'VibeCoding')?.id
                    if (vmId) {
                      navigate(`/vm/${vmId}`)
                    }
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Open VibeStudio Server →
                </button>
              </div>
            </div>
          )}
          
          {setupPhase === 'error' && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Setup failed</span>
              </div>
              <div className="flex justify-center">
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
          
          <div className="pt-4 border-t">
            <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
              <div className={`h-2 w-2 rounded-full ${phaseConfig.color}`}></div>
              <span>VibeStudio Platform</span>
            </div>
            
            {/* Debug info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-2 text-xs text-gray-500 text-center">
                <div>Phase: {setupPhase}</div>
                <div>Progress: {setupProgress}%</div>
                <div>APP ID: {vibeVmId || 'none'}</div>
                <div>APP in store: {vms.length}</div>
                <div>Vibe APP downloaded: {vms.find(vm => vm.type === 'VibeCoding')?.downloaded ? 'yes' : 'no'}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

export default VibeSetupPage