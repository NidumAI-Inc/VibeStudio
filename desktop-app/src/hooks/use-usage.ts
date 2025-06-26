import { useQuery, useMutation, UseQueryOptions } from '@tanstack/react-query'
import {
  getUsageOverview,
  getAllUsages,
  getServerUsage,
  updateUsage,
  UsageEntry,
  UsageOverview,
  UpdateUsagePayload,
  UsageType,
} from '@/actions/usage'

export function useOverviewUsage(type: UsageType, options?: UseQueryOptions<UsageOverview[]>) {
  return useQuery({
    queryKey: ['usage-overview', type],
    queryFn: () => getUsageOverview(type),
    enabled: !!type,
    ...options,
  })
}

export function useAllUsages(type: UsageType, options?: UseQueryOptions<UsageEntry[]>) {
  return useQuery({
    queryKey: ['usage-all', type],
    queryFn: () => getAllUsages(type),
    enabled: !!type,
    ...options,
  })
}

export function useServerUsage(serverId: string, type: UsageType, options?: UseQueryOptions<UsageEntry[]>) {
  return useQuery({
    queryKey: ['usage-server', serverId, type],
    queryFn: () => getServerUsage(serverId, type),
    enabled: !!serverId && !!type,
    ...options,
  })
}

export function useUpdateUsage() {
  return useMutation({
    mutationFn: (payload: UpdateUsagePayload) => updateUsage(payload),
  })
}
