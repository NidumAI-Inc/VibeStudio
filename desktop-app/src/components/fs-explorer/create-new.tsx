import { FilePlus, FolderPlus, Upload, FolderUp, Plus } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import TooltipBtn from '../common/tooltip-btn'

type Props = {
  onCreateNew: (type: 'file' | 'folder') => void
  onUploadClick: () => void
  onUploadFolderClick: () => void
}

function CreateNew({ onCreateNew, onUploadClick, onUploadFolderClick }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TooltipBtn
          variant='outline'
          className='h-9 w-9 rounded-lg border-gray-200 shadow-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all'
          description='Create new'
        >
          <Plus className='h-4 w-4' />
        </TooltipBtn>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-44 p-1 rounded-lg border border-gray-200 shadow-lg' align='end'>
        <DropdownMenuItem
          onClick={() => onCreateNew('file')}
          className='gap-3 px-3 py-2 my-0.5 hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600 cursor-pointer'
        >
          <FilePlus className='h-4 w-4' />
          New File
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onCreateNew('folder')}
          className='gap-3 px-3 py-2 my-0.5 hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600 cursor-pointer'
        >
          <FolderPlus className='h-4 w-4' />
          New Folder
        </DropdownMenuItem>

        <DropdownMenuSeparator className='my-1 mx-1 bg-gray-200' />

        <DropdownMenuItem
          onClick={onUploadClick}
          className='gap-3 px-3 py-2 my-0.5 hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600 cursor-pointer'
        >
          <Upload className='h-4 w-4' />
          Upload File(s)
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onUploadFolderClick}
          className='gap-3 px-3 py-2 my-0.5 hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600 cursor-pointer'
        >
          <FolderUp className='h-4 w-4' />
          Upload Folder
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CreateNew
