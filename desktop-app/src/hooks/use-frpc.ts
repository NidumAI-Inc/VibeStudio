import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createDomain, createFile, deleteDomain, getDomain, start, stop } from '@/actions/frpc'
import useVMStore from '@/store/vm'

export function useGetDomain(domain: string, enabled: boolean) {
  return useQuery({
    queryKey: ['domain', domain],
    queryFn: () => getDomain(domain),
    enabled,
    refetchInterval(query) {
      if (enabled && !query?.state?.data?.verified) {
        return 5000
      }
      return false
    },
  })
}

export function useCreateDomain() {
  return useMutation({
    mutationFn: createDomain,
  })
}

export function useCreateFrpcFile() {
  return useMutation({
    mutationFn: createFile,
  })
}

export function useDeleteDomain() {
  const removeDomain = useVMStore((s) => s.removeDomain)

  return useMutation({
    mutationFn: deleteDomain,
    onSuccess: (_, variables) => {
      removeDomain(variables.vmId, variables.id)
      toast.success('Domain deleted successfully')
    },
    onError: (error) => {
      toast.error(error?.message)
    },
  })
}

export function useStart() {
  const updateDomain = useVMStore((s) => s.updateDomain)

  return useMutation({
    mutationFn: start,
    onSuccess: (_, variables) => {
      updateDomain(variables.vmId, variables.id, { isRunning: true })
      toast.success('Domain started successfully')
    },
    onError: (error) => {
      toast.error(error?.message)
    },
  })
}

export function useStop() {
  const updateDomain = useVMStore((s) => s.updateDomain)

  return useMutation({
    mutationFn: stop,
    onSuccess: (_, variables) => {
      updateDomain(variables.vmId, variables.id, { isRunning: false })
      toast.success('Domain stopped successfully')
    },
    onError: (error) => {
      toast.error(error?.message)
    },
  })
}
