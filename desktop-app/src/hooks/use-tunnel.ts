import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

import useVMStore from '@/store/vm'

import {
  goPublic,
  isLiveCheck,
  stopPublic,
  stopTunnel,
  tunnelReserve,
  tunnelSetupFlow,
  tunnelSetupStatus,
} from '../actions/tunnel'

export function useTunnelSetup() {
  const { isLoading, data } = useQuery({
    queryKey: ['tunnel-setup-status'],
    queryFn: tunnelSetupStatus,
  })

  const { mutate } = useMutation({
    mutationFn: (disable: boolean) => tunnelSetupFlow(disable),
  })

  useEffect(() => {
    if (data) {
      const isSuccess = data?.['url-config'] && data?.['enable']
      if (!isSuccess) {
        mutate(Object.keys(data).length === 0)
      }
    }
  }, [data])

  return {
    isLoading,
    data,
  }
}

export function useTunnelSetupStatus() {
  return useQuery({
    queryKey: ['tunnel-setup-status'],
    queryFn: tunnelSetupStatus,
  })
}

export function useTunnelSetupRetry() {
  const clearTunnel = useVMStore((s) => s.clearTunnel)
  const queryClient = useQueryClient()
  const { id } = useParams()

  return useMutation({
    mutationFn: () => tunnelSetupFlow(true),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['tunnel-setup-status'] })
      clearTunnel(id)
      toast.success('Setup reconfigured successfully.')
    },
    onError() {
      toast.error('Setup failed. Please try again.')
    },
  })
}

export function useTunnelReserveMutate() {
  return useMutation({
    mutationFn: tunnelReserve,
    onSuccess() {
      toast.success('Configuration added, Please click "Go Public" to share your vm.')
    },
    onError(err) {
      console.log(err)
      toast.error(err?.message || 'An error occurred. Please try again.')
    },
  })
}

export function useGoPublicMutate() {
  const updateTunnel = useVMStore((s) => s?.updateTunnel)
  const { id: vmId } = useParams()

  return useMutation({
    mutationFn: goPublic,
    onSuccess(_, tunnelId) {
      toast.success('Public sharing has been enabled.')
      updateTunnel(vmId, tunnelId, { is_public: true })
    },
    onError(err) {
      console.log(err)
      toast.error(err?.message || 'An error occurred. Please try again.')
    },
  })
}

export function useStopPublicMutate() {
  const removeTunnel = useVMStore((s) => s.removeTunnel)
  const { id: vmId } = useParams()

  return useMutation({
    mutationFn: stopPublic,
    onSuccess(_, id) {
      removeTunnel(vmId, id)
      toast.success('Public sharing has been deleted.')
    },
    onError(err) {
      console.log(err)
      toast.error(err?.message || 'An error occurred. Please try again.')
    },
  })
}

export function useStopTunnelMutate() {
  const resetTunnelPublic = useVMStore((s) => s.resetTunnelPublic)
  const { id: vmId } = useParams()

  return useMutation({
    mutationFn: stopTunnel,
    onSuccess() {
      resetTunnelPublic(vmId)
      toast.success('Stopped all public sharing URLs.')
    },
    onError(err) {
      console.error(err)
      toast.error(err?.message || 'An error occurred. Please try again.')
    },
  })
}

export function usePublicShareCheck() {
  const id = ''

  const isPublic = false

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['live-check', id],
    queryFn: () => isLiveCheck(id),
    enabled: isPublic,
    refetchInterval: isPublic ? 3000 : false,
  })

  useEffect(() => {
    if (!isLoading && !isFetching && !data && isPublic) {
      stopTunnel()
    }
  }, [isLoading, isFetching, data, isPublic])

  return {
    isLoading,
    data,
  }
}

export function useStopShareOnAppLeave() {
  const isPublic = false

  useEffect(() => {
    return () => {
      if (isPublic) {
        stopTunnel()
      }
    }
  }, [isPublic])
}
