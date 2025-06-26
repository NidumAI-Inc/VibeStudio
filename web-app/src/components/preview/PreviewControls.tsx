import { Button } from '@/components/ui/button'
import { ExternalLink, Play, Square, RefreshCw, Bug } from 'lucide-react'

interface PreviewControlsProps {
  isRunning: boolean
  previewUrl: string | null
  onRunApp?: () => void
  onKillApp?: () => void
  onRefresh?: () => void
  onCheckErrors?: () => void
  isCheckingErrors?: boolean
}

const PreviewControls = ({
  isRunning,
  previewUrl,
  onRunApp,
  onKillApp,
  onCheckErrors,
  isCheckingErrors,
  onRefresh,
}: PreviewControlsProps) => {
  if (isRunning) {
    return (
      <div className='flex items-center gap-2'>
        {previewUrl && (
          <>
            <Button
              variant='outline'
              size='sm'
              onClick={onRefresh}
              className='border-blue-400/30 text-blue-400 hover:bg-blue-400 hover:text-white'>
              <RefreshCw className='w-4 h-4 mr-2' />
              Refresh
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => window.open(previewUrl, '_blank')}
              className='border-blue-400/30 text-blue-400 hover:bg-blue-400 hover:text-white'>
              <ExternalLink className='w-4 h-4 mr-2' />
              Open in New Tab
            </Button>
          </>
        )}
        {onCheckErrors && (
          <Button
            variant='outline'
            size='sm'
            onClick={onCheckErrors}
            disabled={isCheckingErrors}
            className='border-red-400/30 text-red-400 hover:bg-red-400 hover:text-white'>
            <Bug className='w-4 h-4 mr-2' />
            {isCheckingErrors ? 'Checking...' : 'Check Errors'}
          </Button>
        )}
        {onKillApp && (
          <Button variant='destructive' size='sm' onClick={onKillApp}>
            <Square className='w-4 h-4 mr-2' />
            Stop
          </Button>
        )}
      </div>
    )
  }

  return (
    onRunApp && (
      <Button onClick={onRunApp} size='sm' className='bg-blue-500 text-white hover:bg-blue-600'>
        <Play className='w-4 h-4 mr-2' />
        Start App
      </Button>
    )
  )
}

export default PreviewControls
