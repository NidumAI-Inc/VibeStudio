import { useEffect, useRef } from 'react'
import type { FileNode } from '@/types/file'

interface ContextMenuProps {
  x: number
  y: number
  node: FileNode | null
  onCreateFile: () => void
  onCreateFolder: () => void
  onRename: () => void
  onDelete: () => void
  onDuplicate: () => void
}

export function ContextMenu({
  x,
  y,
  node,
  onCreateFile,
  onCreateFolder,
  onRename,
  onDelete,
  onDuplicate,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect()
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      let adjustedX = x
      let adjustedY = y

      if (x + rect.width > windowWidth) {
        adjustedX = windowWidth - rect.width - 5
      }

      if (y + rect.height > windowHeight) {
        adjustedY = windowHeight - rect.height - 5
      }

      menuRef.current.style.left = `${adjustedX}px`
      menuRef.current.style.top = `${adjustedY}px`
    }
  }, [x, y])

  const handleItemClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation()
    action()
  }

  return (
    <div
      ref={menuRef}
      className='fixed z-50 w-48 rounded border border-gray-200 bg-white text-sm text-gray-800 shadow-lg dark:border-white/10 dark:bg-muted dark:text-white'
      onClick={(e) => e.stopPropagation()}
      style={{ left: x, top: y }}>
      <ul className='py-1'>
        <li
          className='px-4 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10'
          onClick={(e) => handleItemClick(e, onCreateFile)}>
          New File
        </li>
        <li
          className='px-4 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10'
          onClick={(e) => handleItemClick(e, onCreateFolder)}>
          New Folder
        </li>

        {node && (
          <>
            <li className='my-1 border-t border-gray-200 dark:border-white/10' />
            <li
              className='px-4 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10'
              onClick={(e) => handleItemClick(e, onRename)}>
              Rename
            </li>
            {/* Uncomment when needed
            <li
              className="px-4 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10"
              onClick={(e) => handleItemClick(e, onDuplicate)}
            >
              Duplicate
            </li> 
            */}
            <li
              className='px-4 py-1 cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
              onClick={(e) => handleItemClick(e, onDelete)}>
              Delete
            </li>
          </>
        )}
      </ul>
    </div>
  )
}
