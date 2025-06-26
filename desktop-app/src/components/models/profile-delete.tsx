import { useState } from 'react'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'

import useAuthStore from '@/store/auth'
import { useNavigate } from 'react-router'
import { useAccountDeleteConfirmMutate } from '@/hooks/use-user'
import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'

function Delete() {
  const [open, setOpen] = useState(false)
  const clearAuth = useAuthStore((s) => s.clear)
  const navigate = useNavigate()

  const { mutate: mutateDelete, isPending } = useAccountDeleteConfirmMutate()

  const onDelete = () => {
    mutateDelete(undefined, {
      onSuccess: () => {
        clearAuth()
        navigate('/signin', { replace: true })
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type='button'
          onClick={() => setOpen(true)}
          className='px-4 py-2 rounded-md text-sm transition w-full sm:w-auto disabled:opacity-50
             bg-red-600 hover:bg-red-700 text-white 
             dark:!bg-red-500 dark:hover:!bg-red-600 dark:!text-white
             flex items-center gap-2'>
          <Trash2 className='w-4 h-4' />
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent className='bg-card text-foreground'>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold'>Delete Account</DialogTitle>
          <DialogDescription className='text-muted-foreground'>
            This action will permanently delete your account and remove all data from our servers. This cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className='mt-4 flex flex-col sm:flex-row justify-end gap-3'>
          <DialogClose asChild>
            <Button
              type='button'
              disabled={isPending}
              className='px-4 py-2 rounded-md text-sm bg-muted text-foreground border border-border hover:bg-muted/70 transition w-full sm:w-auto'>
              Cancel
            </Button>
          </DialogClose>

          <Button
            type='button'
            onClick={onDelete}
            disabled={isPending}
            className='px-4 py-2 rounded-md text-sm bg-red-600 text-white hover:bg-red-700 transition w-full sm:w-auto disabled:opacity-50'>
            <Trash2 className='w-4 h-4' /> Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default Delete
