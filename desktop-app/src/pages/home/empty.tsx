import { Server, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'

function EmptyState() {
  const navigate = useNavigate()

  return (
    <div className='flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-12 text-center shadow-sm'>
      <div className='flex h-16 w-16 items-center justify-center rounded-full bg-muted'>
        <Server className='h-8 w-8 text-primary' />
      </div>

      <h3 className='mt-6 text-xl font-semibold text-foreground'>No App Servers created yet</h3>

      <div className='mt-2 max-w-md text-center text-muted-foreground'>
        Get started by creating your first App Server. Choose from pre-configured templates or create a custom App
        Server to fit your needs.
      </div>

      <Button className='mt-6' onClick={() => navigate('/create-vm')}>
        <Plus className='mr-2 h-4 w-4' />
        Create App Server
      </Button>
    </div>
  )
}

export default EmptyState
