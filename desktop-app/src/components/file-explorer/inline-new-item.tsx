import { useState, useRef, useEffect } from 'react'
import { File, Folder } from 'lucide-react'

import type { FileType } from '@/types/file'

interface InlineNewItemProps {
  type: FileType
  onSubmit: (name: string) => void
  onCancel: () => void
}

export function InlineNewItem({ type, onSubmit, onCancel }: InlineNewItemProps) {
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim()) {
      onSubmit(name)
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div className='flex items-center py-1'>
      <span className='mr-1'>
        {type === 'folder' ? <Folder className='h-4 w-4 text-blue-500' /> : <File className='h-4 w-4 text-gray-500' />}
      </span>
      <input
        ref={inputRef}
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => (name.trim() ? onSubmit(name) : onCancel())}
        placeholder={`New ${type}...`}
        className='flex-1 rounded border border-blue-300 bg-white text-black placeholder:text-gray-400
             focus:outline-none focus:ring-1 focus:ring-blue-500
             dark:bg-muted dark:text-white dark:placeholder:text-white/50 dark:border-white/20'
      />
    </div>
  )
}
