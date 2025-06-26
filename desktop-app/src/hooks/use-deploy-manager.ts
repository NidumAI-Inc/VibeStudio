import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { nanoid } from 'nanoid'
import { toast } from 'sonner'

import type { deployT } from '@/types/vm'
import useVMStore from '@/store/vm'

import {
  deployReq,
  getAllDeployments,
  getDeploymentLogs,
  getDeploymentStatus,
  createDeploy,
  smartDeploy,
  stop,
  undeploy,
  enhancedRestart,
  zipDeploy,
  zipDeployReq,
  zipReDeploy,
  redeploy,
} from '@/actions/deploy-manager'

export function useGetAllDeployments({ id, port, status }: deployT) {
  return useQuery({
    queryKey: ['deployments', id, port],
    queryFn: () => getAllDeployments(id, port),
    enabled: !!id && !!port && status === 'running',
  })
}

export function useGetDeploymentStatus({ id, port, status, applicationId }: { applicationId: string } & deployT) {
  const enabled = !!id && !!port && status === 'running'
  return useQuery({
    enabled,
    queryKey: ['deployment-status', applicationId],
    queryFn: () => getDeploymentStatus(id, port, applicationId),
    refetchInterval: () => (enabled ? 5000 : false),
  })
}

export function useGetDeploymentLogs({
  id,
  port,
  status,
  applicationId,
  lines = 100,
}: { applicationId: string; lines?: number } & deployT) {
  return useQuery({
    queryKey: ['deployment-logs', applicationId],
    queryFn: () => getDeploymentLogs(id, port, applicationId, lines),
    enabled: !!id && !!port && status === 'running',
  })
}

export function useDeploy(id: string, port: number) {
  const addDeployManager = useVMStore((s) => s.addDeployManager)

  return useMutation({
    mutationFn: (data: deployReq) => createDeploy(port, data),
    onSuccess: (res, variables) => {
      const payload = {
        id: nanoid(),
        ...variables,
        application_id: res.application_id,
      }

      addDeployManager(id, payload)
      toast.success('Deployment started')
    },
    onError: (error) => {
      toast.error('Deployment failed', {
        description: error?.message || 'An error occurred',
      })
    },
  })
}

export function useSmartDeploy(id: string, port: number) {
  return useMutation({
    mutationFn: (data: Partial<deployReq>) => smartDeploy(port, data),
    onSuccess: () => {
      toast.success('Smart deployment started', {
        description: 'Your application is being deployed.',
      })
    },
    onError: (error) => {
      toast.error('Smart deployment failed', {
        description: error?.message || 'An error occurred',
      })
    },
  })
}

export function useZipDeploy(id: string, port: number) {
  const addDeployManager = useVMStore((s) => s.addDeployManager)

  return useMutation({
    mutationFn: (data: Partial<zipDeployReq>) => zipDeploy(port, data),
    onSuccess: (res, variables) => {
      const payload: any = {
        id: nanoid(),
        ...variables,
        application_id: res.application_id,
      }

      addDeployManager(id, payload)
      toast.success('Deployment started', {
        description: 'Your application is being deployed.',
      })
    },
    onError: (error) => {
      toast.error('Deployment failed', {
        description: error?.message || 'An error occurred',
      })
    },
  })
}

export function useZipReDeploy(id: string, port: number, applicationId: string) {
  return useMutation({
    mutationFn: (data: Partial<zipDeployReq>) => zipReDeploy(port, { ...data, applicationId }),
    onSuccess: () => {
      toast.success('Redeployment started', {
        description: 'Your application is being redeployed.',
      })
    },
    onError: (error) => {
      toast.error('Redeployment failed', {
        description: error?.message || 'An error occurred',
      })
    },
  })
}

export function useStopDeploy(id: string, port: number, applicationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => stop(port, applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deployment-status', applicationId] })
      toast.success('Stop started', {
        description: 'Your application is being stopped.',
      })
    },
    onError: (error) => {
      toast.error('Stop failed', {
        description: error?.message || 'An error occurred',
      })
    },
  })
}

export function useRestartDeploy(id: string, port: number, applicationId: string, newPort: number) {
  const updateDeployManager = useVMStore((s) => s.updateDeployManager)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => redeploy(port, applicationId, newPort),
    onSuccess: () => {
      updateDeployManager(id, applicationId, {
        status: 'deploying',
      })
      queryClient.invalidateQueries({ queryKey: ['deployment-status', applicationId] })
      toast.success('Restart started', {
        description: 'Your application is being restarted.',
      })
    },
    onError: (error) => {
      toast.error('Restart failed', {
        description: error?.message || 'An error occurred',
      })
    },
  })
}

export function useEnhancedRestart(id: string, port: number, applicationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newPort: number) => enhancedRestart(port, applicationId, newPort),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deployment-status', applicationId] })
      toast.success('Restart started', {
        description: 'Your application is being restarted.',
      })
    },
    onError: (error) => {
      toast.error('Restart failed', {
        description: error?.message || 'An error occurred',
      })
    },
  })
}

export function useUndeploy(id: string, port: number, applicationId: string) {
  const removeDeployManager = useVMStore((s) => s.removeDeployManager)

  return useMutation({
    mutationFn: () => undeploy(port, applicationId),
    onSuccess: () => {
      removeDeployManager(id, applicationId)
      toast.success('Deployment deleted')
    },
    onError: (error) => {
      removeDeployManager(id, applicationId)
      toast.error('Undeploy failed', {
        description: error?.message || 'An error occurred',
      })
    },
  })
}
