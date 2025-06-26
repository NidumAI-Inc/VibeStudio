import { useState } from 'react'
import { Loader } from 'lucide-react'

import { useCreateNode } from '@/hooks/use-node'
import useUIStore from '@/store/ui'

import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function CreateNew() {
  const { open, data, close } = useUIStore()

  const [newName, setNewName] = useState('')

  const { mutate, isPending } = useCreateNode(data?.id, data?.port)

  const handleCreate = () => {
    if (!newName) return

    let payload = {}

    if (data.type === 'file') {
      payload = {
        filePath: `${data.folderPath}/${newName}`,
        content: '',
      }
    } else {
      payload = {
        folderPath: `${data.folderPath}/${newName}`,
      }
    }

    mutate(payload, {
      onSuccess: () => {
        document.getElementById('select-clear')?.click()
        close()
      },
    })
  }

  return (
    <Dialog open={open === 'fs-create-new'} onOpenChange={close}>
      <DialogContent aria-describedby='create new dialog box'>
        <DialogTitle>New {data?.type === 'file' ? 'File' : 'Folder'}</DialogTitle>

        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={`Enter new ${data?.type === 'file' ? 'file' : 'folder'} name`}
          autoFocus
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              handleCreate()
            }
          }}
        />

        <DialogFooter>
          <Button variant='outline' onClick={close} disabled={isPending}>
            Cancel
          </Button>

          <Button onClick={handleCreate} disabled={isPending}>
            {isPending && <Loader className='size-4 animate-spin' />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateNew
