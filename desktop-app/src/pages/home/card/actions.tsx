import { Activity, EllipsisVertical, Server, Terminal, Trash2 } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface ActionsProps {
  onAction: (action: 'terminal' | 'delete' | 'monitor') => void
  type?: string
}

function Actions({ onAction, type }: ActionsProps) {
  const isOllama = type === 'ollama'
  const isTTS = type === 'TTS'
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='h-8 w-8'>
          <EllipsisVertical className='h-4 w-4' />
          <span className='sr-only'>Actions</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-48'>
        {!(isOllama || isTTS) && (
          <>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onAction('terminal')
              }}>
              <Terminal className='mr-2 h-4 w-4' /> Terminal
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onAction('monitor')
              }}>
              <Activity className='mr-2 h-4 w-4' /> Monitor
            </DropdownMenuItem>

            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            onAction('delete')
          }}
          className='text-red-500 focus:text-red-500'>
          <Trash2 className='mr-2 h-4 w-4' /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Actions
