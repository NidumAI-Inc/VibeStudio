import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { VMStatus, VM } from '@/types/vm'

import { activeVms, getNetworkBytes } from '@/utils/vm-helper'
import { delay } from '@/utils'
import { root } from '@/services/end-points'

import { deleteNode, getNetworkUsageInfos, getVMInfo, isLampLive, lampActions } from '@/actions/vm'
import { restartVmMap, startVm } from '@/actions/vm-manager'

import useAuthStore from '@/store/auth'
import useVMStore from '@/store/vm'

type vmT = {
  id: string
  port: number
  type: 'cpu' | 'mem' | 'fs' | 'network'
  status: VMStatus
}
export function useVm({ id, port, status, type }: vmT) {
  return useQuery({
    queryKey: [`vm-${type}`, id],
    queryFn: () => getVMInfo(id, port, type),
    refetchInterval: status === 'running' ? 3000 : false,
    enabled: status === 'running' && !!port,
  })
}

export function useVmWatch() {
  const vms = useVMStore((s) => s.vms)
  const updateVm = useVMStore((s) => s.updateVM)

  useEffect(() => {
    const mappedRes: Record<string, string> = {}

    const mapped: Record<string, VM> = vms.reduce<Record<string, VM>>((prev, curr) => {
      prev[curr.id] = curr
      mappedRes[curr.id] = ''
      return prev
    }, {})

    const handleVmOutput = (_: any, data: { id: string; data: string }) => {
      // console.log(`[VM ${data.id} OUTPUT]:`, data.data)

      const vm = mapped[data.id]
      const isBinary = vm?.runType === 'binary'
      const status = vm?.status
      const output = data.data

      if (!vm) return
      if (status === 'starting') {
        if (isBinary) {
          updateVm(data.id, {
            status: 'running',
            lastStartedAt: new Date().toISOString(),
            needRestart: false,
          })
          restartVmMap.delete(data.id)

          return
        }

        mappedRes[data.id] += output
        const current = mappedRes[data.id]

        if (current.includes('login:')) {
          window.electronAPI.vmInput(data.id, 'root' + '\r\n')
          mappedRes[data.id] = ''
        } else if (current.includes('Password:')) {
          window.electronAPI.vmInput(data.id, '\r\n')
          mappedRes[data.id] = ''
        } else if (current.includes('Welcome to Nativenode!')) {
          updateVm(data.id, {
            status: 'running',
            lastStartedAt: new Date().toISOString(),
            needRestart: false,
          })
          restartVmMap.delete(data.id)
          mappedRes[data.id] = ''
        } else if (current.includes('VM exited with code')) {
          toast.error('Error occurred while starting Server')
          updateVm(data.id, { status: 'idle' })
          mappedRes[data.id] = ''
        }
      }
    }

    const wrapper = window.ipcRenderer?.on('vm-output', handleVmOutput)

    return () => {
      if (wrapper) {
        // @ts-ignore
        window.ipcRenderer?.off('vm-output', wrapper)
      }
    }
  }, [vms])
}

export function useDeleteVM() {
  return useMutation({
    mutationFn: deleteNode,
    onSuccess: () => {
      toast.success('Vm deleted successfully')
    },
    onError: (err) => {
      console.error(err)
      toast.error('Failed to delete vm')
    },
  })
}

export function useKillAllVms() {
  const resetStatuses = useVMStore((s) => s.resetStatuses)

  useEffect(() => {
    resetStatuses()
    return () => {
      window.electronAPI.killAllVms()
    }
  }, [])
}

export function useLampActions(id: string, port: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (action: 'start' | 'stop' | 'restart') => lampActions(id, port, action),

    onSuccess: (_, action) => {
      const verbMap: Record<typeof action, string> = {
        start: 'started',
        stop: 'stopped',
        restart: 'restarted',
      }

      queryClient.invalidateQueries({ queryKey: [`lamp-status`, id] })
      toast.success(`LAMP ${verbMap[action]} successfully`)
    },

    onError: (err) => {
      console.error(err)
      toast.error('Failed to execute LAMP action')
    },
  })
}

export function useLampStatus(id: string, port: number) {
  return useQuery({
    queryKey: [`lamp-status`, id],
    queryFn: () => isLampLive(id, port),
    enabled: !!id && !!port,
  })
}

export function useVmSocket() {
  const [beat, setBeat] = useState(0)
  const ws = useRef<WebSocket>(null)

  const vms = useVMStore((s) => s.vms)
  const userId = useAuthStore((s) => s._id)

  useEffect(() => {
    if (!userId) return

    ws.current = new WebSocket(`${root.liveBackendUrl}/ws`)

    return () => {
      ws.current?.close()
    }
  }, [userId])

  useEffect(() => {
    if (!userId) return

    const filtered = activeVms(vms)

    async function getInfo() {
      const data = await getNetworkUsageInfos(filtered)

      const list = data?.map((d) => ({
        ...getNetworkBytes(d.network),
        id: d.id,
        userId,
        types: [d.isDomainRunning ? 'domain' : '', d.isTunnelRunning ? 'nativenode' : ''].filter(Boolean),
      }))

      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current?.send(JSON.stringify({ type: 'track-usage', data: list }))
      }

      await delay(5000)
      setBeat((p) => p + 1)
    }

    if (filtered.length > 0) {
      getInfo()
    }
  }, [vms, beat, userId])
}
