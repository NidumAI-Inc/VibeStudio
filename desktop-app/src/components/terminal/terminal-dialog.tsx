import { Loader } from 'lucide-react'

import { startVm, stopVm } from '@/actions/vm-manager'
import useUIStore from '@/store/ui'
import useVMStore from '@/store/vm'

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Terminal from '@/components/terminal'

function TerminalDialog() {
  const close = useUIStore((s) => s.close)
  const data = useUIStore((s) => s.data)
  const open = useUIStore((s) => s.open)

  const vm = useVMStore((s) => s.vms.find((v) => v.id === data?.id))

  const vmStatus = vm?.status
  const vmName = data?.vmName
  const vmId = data?.id

  return (
    <Dialog open={open === 'terminal'} onOpenChange={close}>
      <DialogContent
        className='w-full max-w-2xl sm:max-w-2xl p-0 overflow-hidden gap-0 [&_.close-btn]:top-4'
        onEscapeKeyDown={(e) => e.preventDefault()}>
        <div className='df justify-between pr-12'>
          <DialogTitle className='px-6 py-4'>Terminal - {vmName}</DialogTitle>

          {vmStatus === 'idle' && (
            <Button
              size='sm'
              className='text-xs bg-green-500 text-white hover:bg-green-600'
              onClick={() => startVm(vm)}>
              Start
            </Button>
          )}

          {vmStatus === 'starting' && (
            <Button size='sm' disabled className='text-xs bg-green-500 text-white hover:bg-green-600'>
              <Loader className='h-4 w-4 animate-spin' />
              Starting
            </Button>
          )}

          {vmStatus === 'running' && (
            <Button size='sm' variant='destructive' className='text-xs' onClick={() => stopVm(vmId)}>
              Stop
            </Button>
          )}

          {vmStatus === 'stopping' && (
            <Button size='sm' disabled className='text-xs bg-red-500 text-white hover:bg-red-600'>
              <Loader className='h-4 w-4 animate-spin' />
              Stopping
            </Button>
          )}
        </div>

        <DialogDescription className='sr-only'>Access terminal for {vmName}</DialogDescription>

        <div className='relative'>
          {vmStatus === 'idle' ? (
            <div className='h-[450px] p-2 text-xs bg-black text-white/70'>Start the vm to interact with terminal</div>
          ) : (
            <Terminal vmId={vmId} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TerminalDialog
