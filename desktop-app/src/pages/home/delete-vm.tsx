import { Loader } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useDeleteVM } from '@/hooks/use-vm'
import useUIStore from '@/store/ui'
import useVMStore from '@/store/vm'
import useAuthStore from '@/store/auth'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

function DeleteVm() {
  const navigate = useNavigate()
  const closeModel = useUIStore((s) => s.close)
  const open = useUIStore((s) => s.open)
  const data = useUIStore((s) => s.data)

  const { mutate, isPending } = useDeleteVM()
  const removeVM = useVMStore((s) => s.removeVM)
  const clearVMStore = useVMStore((s) => s.clear)
  const clearAuth = useAuthStore((s) => s.clear)

  function onConfirm() {
    const path = data.diskUrl.split('/').pop()
    if (data?.type === 'TTS') {
      removeVM(data.id)
      closeModel()
      // Complete logout and redirect
      setTimeout(() => {
        console.log('Clearing all data and redirecting to login')
        clearVMStore()
        clearAuth()
        navigate('/login', { replace: true })
        // Force page reload to clear all cache
        window.location.reload()
      }, 200)
      return
    }
    mutate(data?.type === 'ollama' ? 'ollama' : `/downloads/${path}`, {
      onSuccess() {
        removeVM(data.id)
        closeModel()
        // Complete logout and redirect
        setTimeout(() => {
          console.log('Clearing all data and redirecting to login')
          clearVMStore()
          clearAuth()
          navigate('/login', { replace: true })
          // Force page reload to clear all cache
          window.location.reload()
        }, 200)
      },
    })
  }


  return (
    <AlertDialog open={open === 'delete-vm'}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete {data?.name} (app server) permanently.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={closeModel} disabled={isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isPending} className='bg-red-500 hover:bg-red-400'>
            {isPending && <Loader className='size-4 animate-spin' />}
            Delete App Server
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteVm
