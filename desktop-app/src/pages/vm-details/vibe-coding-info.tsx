import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import VibeCodingLogo from '@/assets/imgs/vibecoding.png'

export default function VibeCodingExternalInfo() {
  return (
    <div className='rounded-2xl border border-border bg-muted/40 text-foreground shadow-sm p-5'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='bg-zinc-800 rounded-full p-2'>
            <img src={VibeCodingLogo} alt='Vibe coding logo' className='h-5 w-7' />
          </div>
          <div>
            <h2 className='text-base font-semibold'>Explore VibeStud.io</h2>
            <p className='text-xs text-muted-foreground'>Design, code, and deploy in a unified local environment</p>
          </div>
        </div>
      </div>

      <div className='text-sm text-muted-foreground mt-4 px-1 space-y-4'>
        <p className='leading-relaxed'>
          <strong>app.vibestud.io</strong> is your local-first coding environment to build full-stack apps with live
          feedback and model support.
        </p>

        <ul className='list-disc pl-5 space-y-2'>
          <li>Rapid prototyping with built-in file editor and AI integration</li>
          <li>Chat with your codebase and see instant changes reflected</li>
          <li>Works offline and respects your local project structure</li>
        </ul>

        <div className='pt-2'>
          <Button
            variant='outline'
            size='sm'
            className='gap-2 text-zinc-800 bg-zinc-200 dark:text-zinc-100 dark:bg-zinc-800 font-medium text-sm h-8 px-4 rounded-md'
            onClick={() => window.electronAPI.openExternal?.('https://app.vibestud.io')}>
            <ExternalLink className='w-4 h-4' />
            Open app.vibestud.io
          </Button>
        </div>
      </div>
    </div>
  )
}
