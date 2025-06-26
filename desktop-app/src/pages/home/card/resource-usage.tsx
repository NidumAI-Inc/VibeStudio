import { Cpu, MemoryStick, HardDrive, Upload, Download, Loader } from 'lucide-react'

import type { VMStatus } from '@/types/vm'
import { getProgressColor } from '@/utils'
import { useSystemStatus } from '@/hooks/use-system-status'
import { getNetworkBytes } from '@/utils/vm-helper'
import { useVm } from '@/hooks/use-vm'

import { Progress } from '@/components/ui/progress'

type props = {
  id: string
  port: number
  status: VMStatus
}

type props2 = {
  isRunning: boolean
  isMini?: boolean
}

function ResourceLoader() {
  return <div className='resource-bar h-1.5 bg-muted animate-pulse rounded' />
}

function Spinner() {
  return <Loader className='animate-spin h-3 w-3 text-muted-foreground ml-auto' />
}

export function CpuUsage({ isRunning, isMini = false, id, port, status }: props & props2) {
  const { data: cpu, isLoading } = useVm({ id, port, status, type: 'cpu' })
  const cpuUsedPercent = cpu ? cpu.total : 0

  return (
    <div>
      <div className='df gap-1 text-xs mb-1'>
        <Cpu className='h-3 w-3 mr-1' />
        <span>CPU</span>
        {!isMini &&
          (isLoading ? <Spinner /> : <span className='ml-auto'>{isRunning ? `${cpuUsedPercent}%` : 'Inactive'}</span>)}
      </div>

      {isLoading ? (
        <ResourceLoader />
      ) : (
        <Progress
          value={isRunning ? cpuUsedPercent : 0}
          className='resource-bar h-1.5'
          barClassName={getProgressColor(cpuUsedPercent)}
        />
      )}
    </div>
  )
}

export function MemoryUsage({ isRunning, isMini = false, id, port, status }: props & props2) {
  const { data: ram, isLoading } = useVm({ id, port, status, type: 'mem' })
  const memUsedGB = (ram ? ram.used / 1024 ** 3 : 0).toFixed(2)
  const memTotalGB = (ram ? ram.total / 1024 ** 3 : 0).toFixed(2)
  const memUsedPercent = Number((ram ? (ram.used / ram.total) * 100 : 0).toFixed(2))

  return (
    <div>
      <div className='df gap-1 text-xs mb-1'>
        <MemoryStick className='h-3 w-3 mr-1' />
        <span>Memory</span>
        {!isMini &&
          (isLoading ? (
            <Spinner />
          ) : (
            <span className='ml-auto'>{isRunning ? `${memUsedGB}/${memTotalGB} GB` : 'Inactive'}</span>
          ))}
      </div>

      {isLoading ? (
        <ResourceLoader />
      ) : (
        <Progress
          value={isRunning ? memUsedPercent : 0}
          className='resource-bar h-1.5'
          barClassName={getProgressColor(memUsedPercent)}
        />
      )}
    </div>
  )
}

export function StorageUsage({ isRunning, isMini = false, id, port, status }: props & props2) {
  const { data: disk, isLoading } = useVm({ id, port, status, type: 'fs' })

  let diskUsed = 0
  let diskTotal = 0

  if (disk) {
    for (const di of disk) {
      diskUsed += di.used
      diskTotal += di.size
    }
  }

  const diskUsedGB = (diskUsed / 1024 ** 3).toFixed(2)
  const diskTotalGB = (diskTotal / 1024 ** 3).toFixed(2)
  const diskUsedPercent = Number((disk ? (diskUsed / diskTotal) * 100 : 0).toFixed(2))

  return (
    <div>
      <div className='df gap-1 text-xs mb-1'>
        <HardDrive className='h-3 w-3 mr-1' />
        <span>Disk</span>
        {!isMini &&
          (isLoading ? (
            <Spinner />
          ) : (
            <span className='ml-auto'>{isRunning ? `${diskUsedGB}/${diskTotalGB} GB` : 'Inactive'}</span>
          ))}
      </div>

      {isLoading ? (
        <ResourceLoader />
      ) : (
        <Progress
          value={isRunning ? diskUsedPercent : 0}
          className='resource-bar h-1.5'
          barClassName={getProgressColor(diskUsedPercent)}
        />
      )}
    </div>
  )
}

export function NetworkUsage({ isRunning, id, port, status }: { isRunning: boolean } & props) {
  const { data: network, isLoading } = useVm({ id, port, status, type: 'network' })
  const { downloadMbps, uploadMbps } = getNetworkBytes(network || [])

  if (!isRunning) return null

  return (
    <div className='df pt-2 text-xs text-muted-foreground'>
      <Upload className='size-3 mr-1' />
      <span>{isLoading ? '--' : `${uploadMbps.toFixed(2)}`} MB/s</span>

      <Download className='size-3 mr-1 ml-auto' />
      <span>{isLoading ? '--' : `${downloadMbps.toFixed(2)}`} MB/s</span>
    </div>
  )
}

export function SystemResourceUsage({ isRunning, isMini }: props2) {
  const { data: systemStatus, isLoading } = useSystemStatus()

  return (
    <div className='space-y-3'>
      <div>
        <div className='df gap-1 text-xs mb-1'>
          <Cpu className='h-3 w-3 mr-1' />
          <span>CPU</span>
          {!isMini &&
            (isLoading ? (
              <Spinner />
            ) : (
              <span className='ml-auto'>{isRunning ? `${systemStatus?.cpuUsage}%` : 'Inactive'}</span>
            ))}
        </div>

        {isLoading ? (
          <ResourceLoader />
        ) : (
          <Progress
            value={isRunning ? Number(systemStatus?.cpuUsage ?? 0) : 0}
            className='resource-bar h-1.5'
            barClassName={getProgressColor(Number(systemStatus?.cpuUsage ?? 0))}
          />
        )}
      </div>

      <div>
        <div className='df gap-1 text-xs mb-1'>
          <MemoryStick className='h-3 w-3 mr-1' />
          <span>Memory</span>
          {!isMini &&
            (isLoading ? (
              <Spinner />
            ) : (
              <span className='ml-auto'>
                {isRunning ? `${systemStatus?.ram?.used}/${systemStatus?.ram?.total} GB` : 'Inactive'}
              </span>
            ))}
        </div>

        {isLoading ? (
          <ResourceLoader />
        ) : (
          <Progress
            value={isRunning ? Number(systemStatus?.ram?.percentage ?? 0) : 0}
            className='resource-bar h-1.5'
            barClassName={getProgressColor(Number(systemStatus?.ram?.percentage ?? 0))}
          />
        )}
      </div>

      <div>
        <div className='df gap-1 text-xs mb-1'>
          <HardDrive className='h-3 w-3 mr-1' />
          <span>Disk</span>
          {!isMini &&
            (isLoading ? (
              <Spinner />
            ) : (
              <span className='ml-auto'>
                {isRunning ? `${systemStatus?.disk?.used}/${systemStatus?.disk?.total} GB` : 'Inactive'}
              </span>
            ))}
        </div>

        {isLoading ? (
          <ResourceLoader />
        ) : (
          <Progress
            value={isRunning ? Number(systemStatus?.disk?.percentage ?? 0) : 0}
            className='resource-bar h-1.5'
            barClassName={getProgressColor(Number(systemStatus?.disk?.percentage ?? 0))}
          />
        )}
      </div>
    </div>
  )
}

function ResourceUsage({ id, port, status }: props) {
  const isRunning = status === 'running'

  return (
    <div className='space-y-3'>
      <CpuUsage isRunning={isRunning} id={id} port={port} status={status} />
      <MemoryUsage isRunning={isRunning} id={id} port={port} status={status} />
      <StorageUsage isRunning={isRunning} id={id} port={port} status={status} />
      <NetworkUsage isRunning={isRunning} id={id} port={port} status={status} />
    </div>
  )
}

export default ResourceUsage
