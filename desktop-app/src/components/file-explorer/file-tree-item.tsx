import { useState, useEffect, useRef } from 'react'
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react'

import type { FileNode } from '@/types/file'
import { cn } from '@/lib/utils'

interface FileTreeItemProps {
  node: FileNode
  parentPath: string[]
  selected: boolean
  isRenaming: boolean
  onContextMenu: (e: React.MouseEvent) => void
  onClick: () => void
  onToggle: () => void
  onRename: (newName: string) => void
  children?: React.ReactNode
}

export function FileTreeItem({
  node,
  parentPath,
  selected,
  isRenaming,
  onContextMenu,
  onClick,
  onToggle,
  onRename,
  children,
}: FileTreeItemProps) {
  const isFolder = node.type === 'folder'
  const [editName, setEditName] = useState(node.name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus()
      if (node.type === 'file' && node.name.includes('.')) {
        const dotIndex = node.name.lastIndexOf('.')
        inputRef.current.setSelectionRange(0, dotIndex)
      } else {
        inputRef.current.select()
      }
    }
  }, [isRenaming, node.type, node.name])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onRename(editName)
    } else if (e.key === 'Escape') {
      onRename(node.name)
    }
  }

  return (
    <li className='select-none'>
      <div
        className={cn(
          'flex items-center py-1 px-2 rounded cursor-pointer transition-colors',
          'hover:bg-gray-100 dark:hover:bg-white/5',
          selected && 'bg-blue-100 dark:bg-white/10'
        )}
        onContextMenu={onContextMenu}
        onClick={isRenaming ? undefined : onClick}>
        {isFolder ? (
          <span
            className='mr-1 cursor-pointer'
            onClick={(e) => {
              e.stopPropagation()
              onToggle()
            }}>
            {node.expanded ? <ChevronDown className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}
          </span>
        ) : (
          <span className='w-5' />
        )}

        <span className='mr-1'>
          {isFolder ? (
            node.expanded ? (
              <FolderOpen className='h-4 w-4 text-blue-500 dark:text-white' />
            ) : (
              <Folder className='h-4 w-4 text-blue-500 dark:text-white' />
            )
          ) : (
            <File className='h-4 w-4 text-gray-500 dark:text-gray-300' />
          )}
        </span>

        {isRenaming ? (
          <input
            ref={inputRef}
            type='text'
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => onRename(editName)}
            onClick={(e) => e.stopPropagation()}
            className='flex-1 bg-white dark:bg-muted border border-blue-300 dark:border-white/20 rounded px-1 py-0 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-white/20'
          />
        ) : (
          <span className='truncate text-gray-800 dark:text-white'>{node.name}</span>
        )}
      </div>

      {children}
    </li>
  )
}
