import { useEffect } from 'react'
import { Play, Square, Trash, ExternalLink, Loader, ScrollText } from 'lucide-react'
import { toast } from 'sonner'

import { useStopDeploy, useRestartDeploy, useUndeploy, useGetDeploymentStatus } from '@/hooks/use-deploy-manager'
import type { deployManagerT, deployT } from '@/types/vm'
import useVMStore from '@/store/vm'
import useUIStore from '@/store/ui'

import { TableCell, TableRow } from '@/components/ui/table'
import TooltipBtn from '@/components/common/tooltip-btn'
import GetStatus from '../get-status'

type props = {
  deployment: deployManagerT
  onSelectDeployment: (applicationId: string) => void
} & deployT

function Row({ id, port, status, deployment, onSelectDeployment }: props) {
  const ports = useVMStore((s) => s.vms?.find((vm) => vm.id === id)?.ports?.vm)

  const { data, isLoading, isError } = useGetDeploymentStatus({
    id,
    port,
    status,
    applicationId: deployment.application_id,
  })

  const stopMutation = useStopDeploy(id, port, deployment.application_id)
  const startMutation = useRestartDeploy(id, port, deployment.application_id, deployment.port)
  const undeployMutation = useUndeploy(id, port, deployment.application_id)

  const updateDeployManager = useVMStore((s) => s.updateDeployManager)
  const updateModal = useUIStore((store) => store.update)

  useEffect(() => {
    if (data?.status) {
      updateDeployManager(id, deployment.application_id, {
        status: data?.status,
      })
    }
  }, [data?.status])

  const handleLogClick = () => {
    if (status !== 'running') {
      return toast.warning('Please start vm to continue')
    }
    updateModal({ open: 'log-modal', data: { application_id: deployment.application_id, id } })
  }

  const disabled =
    isLoading ||
    stopMutation.isPending ||
    startMutation.isPending ||
    undeployMutation.isPending ||
    deployment?.status === 'deploying'
  const exposed = ports?.find((p) => p.internal === deployment.port)?.exposed

  return (
    <TableRow
      key={deployment.application_id}
      className='cursor-pointer hover:bg-muted/50'
      onClick={() => onSelectDeployment(deployment.application_id)}>
      <TableCell className='font-mono'>{deployment.application_id}</TableCell>

      <TableCell className='max-w-[300px] truncate'>
        {deployment.description || <span className='text-muted-foreground italic'>No description</span>}
      </TableCell>

      <TableCell>{deployment.port}</TableCell>

      <TableCell>
        {isLoading || deployment?.status === 'deploying' ? (
          <Loader className='animate-spin size-3.5' />
        ) : (
          <GetStatus status={status !== 'running' ? 'idle' : data?.status || (isError ? 'error' : '')} />
        )}
      </TableCell>

      <TableCell>
        <div className='flex space-x-2' onClick={(e) => e.stopPropagation()}>
          {status !== 'running' && '-'}

          {status === 'running' && data?.status === 'online' && (
            <TooltipBtn
              variant='ghost'
              description='Stop application'
              onClick={() => {
                if (status !== 'running') {
                  return toast.warning('Please start vm to continue')
                }
                stopMutation.mutate()
              }}
              disabled={disabled}
              className='hover:bg-gray-200/60'>
              <Square className='h-4 w-4' />
            </TooltipBtn>
          )}

          {status === 'running' && data?.status === 'stopped' && (
            <TooltipBtn
              variant='ghost'
              description='Start application'
              onClick={() => {
                if (status !== 'running') {
                  return toast.warning('Please start vm to continue')
                }
                startMutation.mutate()
              }}
              disabled={disabled}
              className='hover:bg-gray-200/60'>
              <Play className='h-4 w-4' />
            </TooltipBtn>
          )}

          {status === 'running' && (
            <TooltipBtn
              variant='ghost'
              description='Delete application'
              onClick={() => {
                if (status !== 'running') {
                  return toast.warning('Please start vm to continue')
                }
                undeployMutation.mutate()
              }}
              disabled={disabled}
              className='hover:bg-gray-200/60'>
              <Trash className='h-4 w-4' />
            </TooltipBtn>
          )}

          {status === 'running' && exposed && data?.status === 'online' && (
            <TooltipBtn
              variant='ghost'
              description='Open application'
              onClick={() => window.electronAPI?.openExternal?.(`http://localhost:${exposed}`)}
              disabled={disabled}
              className='hover:bg-gray-200/60'>
              <ExternalLink className='h-4 w-4' />
            </TooltipBtn>
          )}

          {status === 'running' && (
            <TooltipBtn
              variant='ghost'
              description='View logs'
              onClick={handleLogClick}
              className='hover:bg-gray-200/60'>
              <ScrollText />
            </TooltipBtn>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}

export default Row
