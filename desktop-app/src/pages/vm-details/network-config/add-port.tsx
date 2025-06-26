import { useForm } from 'react-hook-form'

import { checkPortInUse } from '@/actions/vm'
import useVMStore from '@/store/vm'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

function AddPort({ id }: { id: string }) {
  const updateVM = useVMStore((s) => s.updateVM)
  const vm = useVMStore((s) => s.vms.find((vm) => vm.id === id))

  const { register, reset, handleSubmit } = useForm({
    defaultValues: {
      exposed: '',
      internal: '',
      description: '',
    },
  })

  const handleAddPort = async (data: any) => {
    if (
      vm?.ports?.fs_api?.internal === Number(data.internal) ||
      vm?.ports?.glance?.internal === Number(data.internal)
    ) {
      return toast.error('This internal port is restricted')
    }

    if (vm?.ports?.fs_api?.exposed === Number(data.exposed) || vm?.ports?.glance?.exposed === Number(data.exposed)) {
      return toast.error('This exposed port is restricted')
    }

    if (vm?.ports?.vm?.some((port) => port.internal === Number(data.internal))) {
      return toast.warning('Internal port already exists')
    }

    if (vm?.ports?.vm?.some((port) => port.exposed === Number(data.exposed))) {
      return toast.warning('Exposed port already exists')
    }

    const newPorts = {
      enabled: true,
      editable: true,
      exposed: Number(data.exposed),
      internal: Number(data.internal),
      description: data.description,
    }

    const portInUse = await checkPortInUse(Number(data.exposed))

    if (portInUse.inUse) {
      return toast.warning('Port already in use')
    }

    updateVM(id, {
      ports: {
        ...vm?.ports,
        vm: [...(vm?.ports?.vm || []), newPorts],
      },
      needRestart: vm.status === 'running',
    })

    reset()

    if (vm?.status === 'running') {
      toast.warning('Restart vm to apply changes')
    }
  }

  return (
    <div className='df justify-end mt-8'>
      <Input
        type='number'
        placeholder='Exposed port'
        {...register('exposed', {
          valueAsNumber: true,
          required: true,
        })}
        className='no-number-arrows max-w-[150px]'
      />

      <Input
        type='number'
        placeholder='Internal port'
        className='no-number-arrows max-w-[150px]'
        {...register('internal', {
          valueAsNumber: true,
          required: true,
        })}
      />

      <Input placeholder='Description' {...register('description', { required: true })} />

      <Button onClick={handleSubmit(handleAddPort)} variant='secondary'>
        Add Port
      </Button>
    </div>
  )
}

export default AddPort
