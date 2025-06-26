import { Folder, FileIcon } from 'lucide-react'

import { formatBytes, formatDate } from '@/utils'
import { fileNodeT } from '@/actions/nodes'
import { cn } from '@/lib/utils'

type props = {
  selected: boolean
  onSelect: (e: React.MouseEvent) => void
  onNavigate: () => void
} & fileNodeT

function Items({ name, is_dir, size, mtime, selected, onSelect, onNavigate }: props) {
  return (
    <tr
      className={cn(
        'cursor-pointer transition',
        'hover:bg-gray-100 dark:hover:bg-muted/20',
        selected && 'ring-1 ring-inset ring-gray-300 dark:ring-white/20 dark:bg-white/5'
      )}
      onClick={onSelect}
      onDoubleClick={onNavigate}>
      <td className='py-2 px-4'>
        <div className='flex items-center gap-2'>
          {is_dir ? (
            <Folder size={14} className='text-blue-500 dark:text-gray-200' />
          ) : (
            <FileIcon size={14} className='text-gray-500 dark:text-gray-300' />
          )}

          <span className='truncate text-gray-800 dark:text-gray-100'>{name}</span>
        </div>
      </td>

      <td className='py-2 px-4 text-sm text-gray-500 dark:text-gray-400'>{formatBytes(size)}</td>

      <td className='py-2 px-4 text-sm text-gray-500 dark:text-gray-400'>{formatDate(mtime)}</td>
    </tr>
  )
}

export default Items
