import sendApiReq from '@/services/send-api-req'
import { endPoints } from '@/services/end-points'

export type UsageType = 'nativenode' | 'domain'
export interface UsageEntry {
  bandWidthIn: number
  bandWidthOut: number
  month: string
}

export interface UsageOverview {
  serverId: string
  totalBandWidthIn: number
  totalBandWidthOut: number
}

export interface UpdateUsagePayload {
  serverId: string
  type: UsageType
  bandWidthIn: number
  bandWidthOut: number
  month?: string
}

export function getUsageOverview(type: UsageType): Promise<UsageOverview[]> {
  return sendApiReq({
    url: `${endPoints.usage.overview}/${type}`,
  })
}

export function getAllUsages(type: UsageType): Promise<UsageEntry[]> {
  return sendApiReq({
    url: `/usage/all/${type}`,
  })
}

export function getServerUsage(serverId: string, type: UsageType): Promise<UsageEntry[]> {
  return sendApiReq({
    url: `${endPoints.usage.server}${serverId}/${type}`,
  })
}

export function updateUsage(data: UpdateUsagePayload): Promise<{ message: string }> {
  return sendApiReq({
    url: endPoints.usage.update,
    method: 'post',
    data,
  })
}
