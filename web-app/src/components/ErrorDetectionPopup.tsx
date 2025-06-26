import { AlertTriangle, X, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ErrorDetectionPopupProps {
  isOpen: boolean
  onClose: () => void
  onTryFix: () => void
  errorDetails: {
    install: string
    runtime: string
  } | null
}

const ErrorDetectionPopup = ({ isOpen, onClose, onTryFix, errorDetails }: ErrorDetectionPopupProps) => {
  // console.log('🚨 ErrorDetectionPopup render - isOpen:', isOpen, 'errorDetails:', errorDetails);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md bg-red-950/90 border-red-500/50 z-[99999] max-h-[80vh] overflow-hidden'>
        <DialogHeader>
          <div className='flex items-center gap-2'>
            <AlertTriangle className='w-5 h-5 text-red-400 flex-shrink-0' />
            <DialogTitle className='text-red-100'>Error Detected</DialogTitle>
          </div>
          <DialogDescription className='text-red-200'>
            Issues were found in your project logs. Would you like me to try to fix them automatically?
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-3 overflow-hidden'>
          {errorDetails && (
            <div className='text-xs bg-black/50 p-3 rounded border max-h-48 overflow-y-auto overflow-x-hidden'>
              {errorDetails.install && (
                <div className='mb-2'>
                  <div className='text-red-300 font-medium mb-1'>Install logs:</div>
                  <div className='text-red-100 whitespace-pre-wrap break-words overflow-wrap-anywhere'>
                    {errorDetails.install}
                  </div>
                </div>
              )}
              {errorDetails.runtime && (
                <div>
                  <div className='text-red-300 font-medium mb-1'>Runtime logs:</div>
                  <div className='text-red-100 whitespace-pre-wrap break-words overflow-wrap-anywhere'>
                    {errorDetails.runtime}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className='flex gap-2 justify-end flex-shrink-0'>
            <Button
              variant='outline'
              size='sm'
              onClick={onClose}
              className='border-red-500/50 text-red-100 hover:bg-red-900/50'>
              <X className='w-4 h-4 mr-1' />
              Dismiss
            </Button>
            <Button size='sm' onClick={onTryFix} className='bg-red-600 hover:bg-red-700 text-white'>
              <Wrench className='w-4 h-4 mr-1' />
              Try Fix
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ErrorDetectionPopup
