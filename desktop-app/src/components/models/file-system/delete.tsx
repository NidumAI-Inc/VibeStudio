import { Loader2 } from 'lucide-react'

import { useDeleteNode } from '@/hooks/use-node'
import useUIStore from '@/store/ui'

import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

function DeleteModal() {
  const { open, data, close } = useUIStore()

  const { mutate, isPending } = useDeleteNode(data.id, data.port)

  const handleDelete = async () => {
    const payload = []

    for (const item of data.selectedItems) {
      payload.push([data?.currentPath, item].join('/').replace('//', '/'))
    }

    mutate(payload, {
      onSuccess: () => {
        document.getElementById('select-clear')?.click()
        close()
      },
    })
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleDelete()
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
    }
  }

  return (
    <Dialog open={open === 'fs-delete'} onOpenChange={close}>
      <DialogContent onKeyDown={handleKeyDown} aria-describedby='delete-description'>
        <DialogTitle>Confirm Delete</DialogTitle>

        <p className='text-sm text-muted-foreground'>Are you sure you want to delete the following?</p>

        <p>Root: {data?.currentPath}</p>
        <ul className='-mt-2 -mr-6 pr-6 max-h-60 overflow-y-auto list-decimal list-inside text-sm text-muted-foreground'>
          {data?.selectedItems.map((item: string) => (
            <li key={item} className='mb-1'>
              {item}
            </li>
          ))}
        </ul>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='secondary' disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>

          <Button variant='destructive' disabled={isPending} onClick={handleDelete}>
            {isPending && <Loader2 className='w-4 h-4 animate-spin' />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteModal
