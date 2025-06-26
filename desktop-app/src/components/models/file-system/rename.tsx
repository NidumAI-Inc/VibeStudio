import { useState } from 'react'
import { Loader2 } from 'lucide-react'

import { useRenameNode } from '@/hooks/use-node'
import useUIStore from '@/store/ui'

import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function RenameModal() {
  const { open, data, close } = useUIStore()

  const [newName, setNewName] = useState(data?.currentName || '')

  const { mutate, isPending } = useRenameNode(data.id, data.port)

  const handleRename = async () => {
    const currentName = data?.currentName || ''
    const currentPath = data?.currentPath || ''

    const trimmedName = newName.trim()
    if (!trimmedName) return

    const oldPath = `${currentPath}/${currentName}`.replace(/\/{2,}/g, '/')
    const pathSegments = oldPath.split('/')
    pathSegments[pathSegments.length - 1] = trimmedName
    const newPath = pathSegments.join('/')

    mutate(
      { oldPath, newPath },
      {
        onSuccess: () => {
          document.getElementById('select-clear')?.click()
          close()
        },
      }
    )
  }

  return (
    <Dialog open={open === 'fs-rename'} onOpenChange={close}>
      <DialogContent aria-describedby='rename dialog box'>
        <DialogTitle>Rename {data?.type === 'folder' ? 'Folder' : 'File'}</DialogTitle>
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={`Enter new ${data?.type || 'file'} name`}
          autoFocus
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              handleRename()
            }
            if (event.key === 'Escape') {
              event.preventDefault()
              close()
            }
          }}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='secondary' disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>

          <Button onClick={handleRename} disabled={isPending}>
            {isPending && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default RenameModal
