import { AlertCircle, RefreshCw, TriangleAlert } from 'lucide-react'

import { useTunnelSetupRetry } from '@/hooks/use-tunnel'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface StepProps {
  number: number
  text: string
}

function Step({ number, text }: StepProps) {
  return (
    <div className='flex items-start gap-3'>
      <div className='flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center'>
        <span className='text-xs font-medium text-primary'>{number}</span>
      </div>
      <p className='text-sm pt-0.5 text-muted-foreground'>{text}</p>
    </div>
  )
}

function TunnelTroubleshootModal() {
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useTunnelSetupRetry()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className='h-9 px-4 text-sm font-medium flex items-center justify-center gap-2 border-border text-primary hover:bg-muted transition-colors'>
          <TriangleAlert className='w-4 h-4' />
          <span className='leading-none'>Troubleshoot</span>
        </Button>
      </DialogTrigger>

      <DialogContent
        aria-describedby='tunnel trouble shoot dialog box'
        className='sm:max-w-md bg-background rounded-lg'>
        <DialogHeader>
          <div className='flex items-center gap-2'>
            <TriangleAlert size={20} className='text-muted-foreground' />
            <DialogTitle className='text-foreground text-xl font-semibold'>Network Troubleshooter</DialogTitle>
          </div>
        </DialogHeader>

        <div className='py-4'>
          <div className='space-y-4 text-foreground'>
            <Step number={1} text='Confirm your internet connection' />
            <Step number={2} text='Update to the latest Native Node App' />
            <Step number={3} text='Check firewall settings' />
            <Step number={4} text='Reconfigure network settings' />
            <Step number={5} text='Click reconfigure button' />

            <div className='mb-1 pt-2 text-sm flex items-start gap-2'>
              <AlertCircle size={16} className='text-red-500 mt-0.5 flex-shrink-0' />
              <p className='text-muted-foreground'>Note: All previous tunnel data will be lost</p>
            </div>

            <div className='pt-2 text-sm flex items-start gap-2'>
              <AlertCircle size={16} className='text-amber-500 mt-0.5 flex-shrink-0' />
              <p className='text-muted-foreground'>
                If issues persist, contact support at{' '}
                <a
                  href='mailto:info@nativenode.tech'
                  className='text-primary underline underline-offset-2 hover:text-primary/80'>
                  info@nativenode.tech
                </a>
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className='flex justify-end gap-3'>
          <DialogClose asChild disabled={isPending}>
            <Button variant='outline' className='border-border text-foreground hover:bg-muted' onClick={() => {}}>
              Cancel
            </Button>
          </DialogClose>

          <Button
            disabled={isPending}
            className={`bg-primary hover:bg-primary/90 text-white dark:bg-white dark:text-black ${
              isPending ? 'opacity-80' : ''
            }`}
            onClick={() =>
              mutate(undefined, {
                onSuccess: () => {
                  setOpen(false)
                },
              })
            }>
            <RefreshCw size={16} className={`mr-2 ${isPending ? 'animate-spin' : ''}`} />
            {isPending ? 'Reconfiguring...' : 'Reconfigure'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default TunnelTroubleshootModal
