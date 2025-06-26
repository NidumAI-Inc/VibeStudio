import { Copy, ExternalLink, Globe, Loader, Trash2 } from 'lucide-react'

import { useGoPublicMutate, useStopPublicMutate } from '@/hooks/use-tunnel'
import useClipboardCopy from '@/hooks/use-clipboard-copy'

import { LiveWave } from '@/components/ui/live-wave'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Props = {
  id: string
  port: number
  tunnelUrl: string
  isPublic: boolean
}

function PortPublicRow({ id, port, tunnelUrl, isPublic }: Props) {
  const { onCopyClk, onTextClk, selectTextRef } = useClipboardCopy()

  const { mutate: goPublic, isPending: isGoingLive } = useGoPublicMutate()
  const { mutate: stopPublic, isPending: isStopping } = useStopPublicMutate()

  return (
    <div className='flex flex-wrap items-center gap-3'>
      <div className='bg-muted px-3 py-1 rounded-lg text-sm font-medium text-muted-foreground min-w-[60px] text-center'>
        {port}
      </div>

      <div className='relative flex-1 min-w-[200px] max-w-md'>
        <Input
          ref={selectTextRef}
          readOnly
          disabled={!tunnelUrl}
          value={tunnelUrl}
          placeholder='Your public URL will be shown here'
          onClick={onTextClk}
          className='font-mono text-sm pr-10 cursor-pointer'
        />
        <button
          type='button'
          onClick={() => onCopyClk(tunnelUrl)}
          className='absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary'>
          <Copy className='w-4 h-4' />
        </button>
      </div>

      {isPublic ? (
        <Button
          variant='outline'
          title='Open public URL'
          className='w-28 text-green-600 bg-green-100 font-medium text-sm h-8 px-4 rounded-md'
          onClick={() => window.electronAPI?.openExternal?.(tunnelUrl)}>
          <LiveWave size={6} />
          <span className='ml-2'>Live</span>
          <ExternalLink className='w-4 h-4 ml-1 opacity-70' />
        </Button>
      ) : (
        <Button size='sm' onClick={() => goPublic(id)} disabled={isGoingLive} className='w-28'>
          {isGoingLive ? (
            <Loader className='animate-spin h-3 w-3 text-muted-foreground ml-auto dark:text-black/50' color='white' />
          ) : (
            <Globe className='w-4 h-4 mr-1' />
          )}
          Go Public
        </Button>
      )}

      <Button size='sm' variant='destructive' onClick={() => stopPublic(id)} disabled={isStopping}>
        {isStopping ? (
          <Loader className='animate-spin h-3 w-3 text-muted-foreground ml-auto' color='white' />
        ) : (
          <Trash2 className='w-4 h-4' />
        )}
        Delete
      </Button>
    </div>
  )
}

export default PortPublicRow
