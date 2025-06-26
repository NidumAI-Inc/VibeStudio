import { useEffect, useRef } from 'react'
import { X, Loader2, CheckCircle } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import useDownloadQueue from '@/hooks/use-download-queue'

export default function DownloadProgressModal({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const { progressMap } = useDownloadQueue()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <div
      ref={ref}
      className='fixed bottom-[100px] right-6 z-[9999] w-[320px] rounded-2xl border border-border bg-card/90 backdrop-blur-xl shadow-xl ring-1 ring-border/20 animate-fade-in text-foreground'>
      <div className='flex items-center justify-between px-4 py-3 border-b border-border'>
        <h4 className='text-sm font-semibold tracking-tight'>📦 Downloading VMs</h4>
        <button
          onClick={onClose}
          className='rounded hover:bg-muted p-1 transition text-muted-foreground hover:text-foreground'>
          <X className='w-4 h-4' />
        </button>
      </div>

      <div className='px-4 py-3 space-y-4 max-h-64 overflow-y-auto'>
        {Object.entries(progressMap).length === 0 ? (
          <div className='text-sm text-muted-foreground text-center py-6'>No active downloads</div>
        ) : (
          Object.entries(progressMap).map(([id, { title = 'Unnamed Server', progress }]) => {
            const isDone = progress === 100
            const Icon = isDone ? CheckCircle : Loader2
            return (
              <div key={id} className='space-y-1'>
                <div className='flex items-center justify-between text-sm font-medium'>
                  <div className='flex items-center gap-2 max-w-[200px] truncate'>
                    <Icon className={`w-4 h-4 ${isDone ? 'text-green-500' : 'text-muted-foreground animate-spin'}`} />
                    <span className='truncate' title={title}>
                      {title}
                    </span>
                  </div>
                  <span className='text-muted-foreground'>{progress}%</span>
                </div>

                <Progress
                  value={progress}
                  className='h-2 overflow-hidden rounded-full bg-muted/50 [&_[data-slot=progress-indicator]]:bg-white-500'
                />
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
