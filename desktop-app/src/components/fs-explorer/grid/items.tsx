import { FileIcon, Folder } from 'lucide-react'

import { getColorByExtension } from '@/utils/files'
import { formatBytes } from '@/utils'
import { fileNodeT } from '@/actions/nodes'
import { cn } from '@/lib/utils'

import FilenameWithTooltip from '@/components/ui/file-name-with-tooltip'

type props = {
  selected: boolean
  onSelect: (e: React.MouseEvent) => void
  onNavigate: () => void
} & fileNodeT

function Items({ name, is_dir, size, selected, onSelect, onNavigate }: props) {
  const fileColorClass = getColorByExtension(name)

  return (
    <div
      className={cn(
        'flex flex-col items-center text-center rounded-lg p-4 select-none cursor-pointer transition-colors',
        'bg-white dark:bg-card',
        'hover:bg-gray-100 dark:hover:bg-muted/20',
        selected && ['ring-2 ring-blue-300 dark:ring-white/20', 'bg-blue-50 dark:bg-white/10']
      )}
      onClick={onSelect}
      onDoubleClick={onNavigate}>
      <div
        className={cn(
          'flex items-center justify-center w-16 h-16 mb-2 rounded-lg',
          is_dir ? 'bg-muted/30 dark:bg-muted/10' : 'bg-gray-50 dark:bg-muted/10'
        )}>
        {is_dir ? (
          <Folder className='w-8 h-8 text-blue-500 dark:text-blue-400' />
        ) : (
          <FileIcon className={cn('w-8 h-8', fileColorClass)} />
        )}
      </div>

      <div className='relative w-full text-center'>
        <span className={cn('truncate text-sm', !is_dir && fileColorClass)}>
          <FilenameWithTooltip name={name} />
        </span>
      </div>

      {!is_dir && <span className='mt-1 text-xs text-gray-500 dark:text-muted-foreground'>{formatBytes(size)}</span>}
    </div>
  )
}

export default Items
