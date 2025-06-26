import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const InternetWatcher = () => {
  const navigate = useNavigate()
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const online = navigator.onLine
      if (!online) {
        setIsOffline(true)
        navigate('/dashboard')
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [navigate])

  return (
    <Dialog open={isOffline} onOpenChange={setIsOffline}>
      <DialogContent
        className={cn(
          'bg-red-50 border-red-500 text-red-900',
          'dark:bg-red-950 dark:border-red-800 dark:text-red-100'
        )}>
        <DialogHeader>
          <DialogTitle className='text-red-700 dark:text-red-400'>Oops...You Are Offline</DialogTitle>
          <DialogDescription className='text-red-600 dark:text-red-300'>
            You've been redirected to the dashboard due to a network issue. Please check your internet connection.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='destructive' onClick={() => setIsOffline(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default InternetWatcher
