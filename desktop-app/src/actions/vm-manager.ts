import type { VM } from '@/types/vm'
import useVMStore from '@/store/vm'

export const restartVmMap = new Map<string, VM>()

export async function startVm(vm: VM) {
  const updateVM = useVMStore.getState().updateVM

  const ports = [
    { internal: vm?.ports?.glance?.internal, exposed: vm?.ports?.glance?.exposed },
    { internal: vm?.ports?.fs_api?.internal, exposed: vm?.ports?.fs_api?.exposed },
    ...vm?.ports?.vm?.map((v) => ({ internal: v.internal, exposed: v.exposed })),
  ]

  const isBinary = vm.runType === 'binary'

  try {
    updateVM(vm.id, { status: 'starting' })
    
    await window.electronAPI.vmStart(vm.id, {
      diskName: isBinary ? 'ollama' : vm.diskUrl?.split('/')?.pop(),
      ports: isBinary ? [] : ports,
      cpuCore: isBinary ? 1 : vm.resourceConfig.cpu,
      memory: isBinary ? 1024 : vm.resourceConfig.ram * 1024,
    })
    
    console.log('VM start command sent successfully for:', vm.name)
  } catch (error) {
    console.error('Error starting VM:', error)
    updateVM(vm.id, { status: 'error' })
    throw error // Re-throw so the caller can handle it
  }
}

export async function stopVm(id: string) {
  const vm = useVMStore.getState().vms.find((v) => v.id === id)
  const updateVM = useVMStore.getState().updateVM

  if (!vm) return

  updateVM(id, { status: 'stopping' })

  try {
    if (vm.runType === 'binary') {
      await window.electronAPI.vmStop(id)
      updateVM(id, { status: 'idle', needRestart: false })
    } else {
      await window.electronAPI.vmInput(id, 'poweroff\r\n')
      updateVM(id, { status: 'idle', needRestart: false })
    }
  } catch (err) {
    updateVM(id, { status: 'idle' }) // fallback
  }
}

export function restartVm(id: string, vm: VM) {
  restartVmMap.set(id, vm)
  stopVm(id)
}
