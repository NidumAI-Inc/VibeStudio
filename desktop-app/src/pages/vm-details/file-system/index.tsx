import { FileWarning } from 'lucide-react'

import type { deployT } from '@/types/vm'

import FSExplorer from '@/components/fs-explorer'

function FileSystem({ id, port, status }: deployT) {
  if (status !== 'running') {
    return (
      <div className='flex flex-col items-center justify-center h-[300px] text-muted-foreground bg-muted/30 rounded-lg shadow-sm border border-muted p-6'>
        <p className='flex items-center justify-center w-14 h-14 rounded-full bg-muted'>
          <FileWarning className='w-8 h-8 text-primary' />
        </p>

        <p className='text-base font-medium mt-4'>Server not available yet</p>

        <p className='text-sm text-center text-muted-foreground mt-2 max-w-md'>
          Start the vm to initialize the environment to get files/folders. Once initialized, your files/folders will
          appear here.
        </p>
      </div>
    )
  }

  return (
    <div className='h-full'>
      <FSExplorer id={id} port={port} status={status} />
    </div>
  )
}

export default FileSystem
