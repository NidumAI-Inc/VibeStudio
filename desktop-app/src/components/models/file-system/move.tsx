import { useState } from 'react'

import { useMoveNode, useNodesList } from '@/hooks/use-node'
import useUIStore from '@/store/ui'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

import Navigator from '@/components/fs-explorer/navigator'
import Grid from '@/components/fs-explorer/grid'

function Move() {
  const close = useUIStore((s) => s.close)
  const open = useUIStore((s) => s.open)
  const data = useUIStore((s) => s.data)

  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [currentPath, setCurrentPath] = useState('')

  const currentPathArr = currentPath?.split('/').filter(Boolean) || []

  const { data: nodes, isLoading } = useNodesList({
    id: data?.id,
    port: data?.port,
    status: data?.status,
    folderPath: currentPath || '/',
  })

  const { mutate, isPending } = useMoveNode(data?.id, data?.port, data?.type)

  function onNavigate(path: string) {
    setSelectedItems([])
    setCurrentPath(path)
  }

  async function onMove() {
    const payload = []

    for (const item of data.selectedItems) {
      payload.push({
        src: [data?.currentPath, item].join('/').replace('//', '/'),
        dst: [currentPath, item].join('/').replace('//', '/'),
      })
    }

    mutate(payload, {
      onSuccess: () => {
        document.getElementById('select-clear')?.click()
        close()
      },
    })
  }

  return (
    <Dialog open={open === 'fs-move'} onOpenChange={close}>
      <DialogContent aria-describedby='move dialog box' className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{data?.type === 'move' ? 'Move' : 'Copy'} Files/Folders</DialogTitle>
          <DialogDescription>
            Select the destination folder to {data?.type === 'move' ? 'move' : 'copy'} the selected files/folders.
          </DialogDescription>
        </DialogHeader>

        <Navigator
          currentPathArr={currentPathArr}
          onRootClick={() => onNavigate('/')}
          onNavigate={(v) => {
            const toIndex = currentPath.indexOf(v)
            const newPathh = currentPath.slice(0, toIndex + v.length)
            onNavigate(newPathh)
          }}
        />

        <div className='h-96 overflow-y-auto p-1 pr-6 -mr-6 -mt-2'>
          <Grid
            nodes={nodes}
            search=''
            showFiles={false}
            isLoading={isLoading}
            selectedItems={selectedItems}
            onSelect={(v) => setSelectedItems([v])}
            onNavigate={(v) => {
              setSelectedItems([])
              setCurrentPath((p) => p + '/' + v)
            }}
          />
        </div>

        {(currentPath || selectedItems?.length > 0) && (
          <DialogFooter className='items-center gap-4'>
            <p className='flex-1'>Selected: {[currentPath, ...selectedItems].join('/').replace('//', '/')}</p>

            <DialogClose asChild>
              <Button variant='secondary'>Cancel</Button>
            </DialogClose>

            <Button onClick={onMove} disabled={isPending}>
              {data?.type === 'move' ? 'Move' : 'Copy'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default Move
