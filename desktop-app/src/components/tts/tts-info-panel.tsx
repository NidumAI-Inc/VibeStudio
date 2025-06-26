import { AudioWaveform, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function TTSExternalInfo() {
  return (
    <div className='rounded-2xl border border-border bg-muted/40 text-foreground shadow-sm p-5'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='bg-primary/10 text-primary rounded-full p-2'>
            <AudioWaveform className='w-6 h-6' />
          </div>
          <div>
            <h2 className='text-base font-semibold'>Use TTS Engines via Audio.Nidum</h2>
            <p className='text-xs text-muted-foreground'>Link your backend and start generating speech instantly</p>
          </div>
        </div>
      </div>

      <div className='text-sm text-muted-foreground mt-4 px-1 space-y-4'>
        <p className='leading-relaxed'>
          <strong>audio.nativenode.tech</strong> provides a frontend to interact with your TTS engine—whether it's running
          locally or on a hosted endpoint.
        </p>

        <ul className='list-disc pl-5 space-y-2'>
          <li>Start your TTS backend server locally or in your cloud environment.</li>
          <li>
            Open <strong>audio.nativenode.tech</strong> and either paste the backend URL manually or use the auto-detect
            feature.
          </li>
          <li>Generate high-quality speech using your custom or preconfigured models.</li>
        </ul>

        <div className='pt-2'>
          <Button
            variant='outline'
            size='sm'
            className='gap-2 text-green-600 bg-green-100 font-medium text-sm h-8 px-4 rounded-md'
            onClick={() => window.electronAPI.openExternal?.('https://audio.nativenode.tech/')}>
            <ExternalLink className='w-4 h-4' />
            Open audio.nativenode.tech
          </Button>
        </div>
      </div>
    </div>
  )
}
