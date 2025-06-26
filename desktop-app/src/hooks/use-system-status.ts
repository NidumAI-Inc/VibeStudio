import { useQuery } from '@tanstack/react-query'

const { ipcRenderer } = window

type SystemStatus = {
  cpuUsage: string
  ram: { used: number; total: number; percentage: number }
  disk: { used: number; total: number; percentage: number }
}

async function fetchSystemStatus(): Promise<SystemStatus> {
  return await ipcRenderer.invoke('get-system-status')
}

export function useSystemStatus() {
  return useQuery({
    queryKey: ['system-status'],
    queryFn: fetchSystemStatus,
    refetchInterval: 3000,
    retry: true,
  })
}
