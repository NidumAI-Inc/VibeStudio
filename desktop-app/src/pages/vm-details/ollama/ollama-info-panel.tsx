import { ExternalLink } from 'lucide-react'

import { Button } from '@/components/ui/button'

import Ollama from '@/assets/svg/ollama'

export function OllamaExternalInfo() {
  return (
    <div className='rounded-2xl border border-border bg-muted/40 text-foreground shadow-sm p-5'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='bg-primary/10 text-primary rounded-full p-2'>
            <Ollama className='w-6 h-6' />
          </div>
          <div>
            <h2 className='text-base font-semibold'>Use Ollama Models from App.Nidum</h2>
            <p className='text-xs text-muted-foreground'>Configure, test, and access models remotely</p>
          </div>
        </div>
      </div>

      <div className='text-sm text-muted-foreground mt-4 px-1 space-y-4'>
        <p className='leading-relaxed'>
          <strong>ollama.nativenode.tech</strong> is a hosted workspace where you can manage Ollama models securely and locally.
        </p>

        <ul className='list-disc pl-5 space-y-2'>
          <li>
            Set up a model like <code className='font-mono text-foreground'>nidumai/nidum-limitless-gemma-2b</code> once
            and reuse it anywhere.
          </li>
          <li>Access powerful web-based tools for testing, tracking, and monitoring model usage in real time.</li>
          <li>All models run on your machine or a private endpoint. Nothing is uploaded to the cloud.</li>
        </ul>

        <div className='pt-2'>
          <Button
            variant='outline'
            size='sm'
            className='gap-2 text-green-600 bg-green-100 font-medium text-sm h-8 px-4 rounded-md'
            onClick={() => window.electronAPI.openExternal?.('https://ollama.nativenode.tech/start-chat?modal=ollama-config')}>
            <ExternalLink className='w-4 h-4' />
            Open ollama.nativenode.tech
          </Button>
        </div>
      </div>
    </div>
  )
}
