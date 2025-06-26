import { useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { useFileContent } from '@/hooks/use-node'
import useUIStore from '@/store/ui'
import useVMStore from '@/store/vm'

export default function LogsModal() {
  const { application_id: applicationId, id } = useUIStore((store) => store.data)
  const open = useUIStore((store) => store.open)
  const close = useUIStore((store) => store.close)

  const portForFS = useVMStore((store) => store.vms.find((v) => v.id === id)?.ports.fs_api.exposed)
  const port = useVMStore(
    (store) => store.vms.find((v) => v.id === id)?.deployManager?.find((d) => d.application_id === applicationId)?.port
  )

  const { data, isLoading, error } = useFileContent(id, `/nativenode/deploy_logs/${applicationId}.log`, portForFS, 3000)

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [data])

  return (
    <Dialog open={open === 'log-modal'} onOpenChange={close}>
      <DialogContent
        aria-describedby='logs dialog box'
        className='!w-[90vw] !max-w-[90vw] !h-[85vh] p-6 overflow-hidden flex flex-col gap-2
                   bg-white dark:bg-card text-foreground dark:text-white border border-border dark:border-white/10'>
        <div>
          <DialogTitle className='text-xl text-foreground dark:text-white'>Logs for {applicationId}</DialogTitle>
          <DialogDescription className='my-1 text-muted-foreground dark:text-white/70'>
            on port <strong className='text-foreground dark:text-white'>{port}</strong>
          </DialogDescription>
        </div>

        <div className='flex-1 overflow-hidden'>
          <div
            ref={scrollRef}
            className='h-full overflow-auto rounded-md border border-border dark:border-white/10
                       bg-black dark:bg-muted text-white p-4 text-sm whitespace-pre-wrap'>
            {isLoading ? (
              <p className='text-white/70'>Loading logs…</p>
            ) : error ? (
              <p className='text-red-500'>Failed to fetch logs. Backend connection was reset.</p>
            ) : data ? (
              <pre className='whitespace-pre-wrap'>{data}</pre>
            ) : (
              <p className='text-muted-foreground dark:text-white/50'>No logs found.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
