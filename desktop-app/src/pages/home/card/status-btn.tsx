import { Play, StopCircle, Loader, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { VMStatus } from '@/types/vm'

type Props = {
  size?: 'default' | 'sm'
  variant?: 'default' | 'outline' | 'secondary'
  status: VMStatus
  className?: string
  onAction: (action: 'start' | 'stop') => void
}

function StatusButton({
  size = 'default',
  variant = 'outline',
  status,
  className = 'flex-1',
  onAction,
}: Props) {
  switch (status) {
    case 'idle':
      return (
        <Button
          onClick={(e) => {
            e.stopPropagation()
            onAction('start')
          }}
          size={size}
          variant={variant}
          className={className}>
          <Play className='h-4 w-4' /> Start
        </Button>
      )

    case 'starting':
      return (
        <Button size={size} variant={variant} className={className} disabled>
          <Loader className='h-4 w-4 animate-spin' />
          Starting
        </Button>
      )

    case 'running':
      return (
        <Button
          onClick={(e) => {
            e.stopPropagation()
            onAction('stop')
          }}
          size={size}
          variant={variant}
          className={className}>
          <StopCircle className='h-4 w-4' /> Stop
        </Button>
      )

    case 'stopping':
      return (
        <Button size={size} variant={variant} className={className} disabled>
          <Loader className='h-4 w-4 animate-spin' />
          Stopping
        </Button>
      )

    case 'error':
      return (
        <Button size={size} variant='outline' className={className} disabled>
          <AlertCircle className='h-4 w-4' /> Error
        </Button>
      )

    default:
      return null
  }
}

export default StatusButton
