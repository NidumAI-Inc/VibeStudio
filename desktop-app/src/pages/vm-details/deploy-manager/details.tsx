import { useEffect, useState } from 'react'
import { ArrowLeft, Play, Square, RefreshCw, Trash, ExternalLink, Loader } from 'lucide-react'

import {
  useGetDeploymentLogs,
  useGetDeploymentStatus,
  useRestartDeploy,
  useStopDeploy,
  useUndeploy,
} from '@/hooks/use-deploy-manager'
import type { deployT } from '@/types/vm'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import GetStatus from './get-status'
import useVMStore from '@/store/vm'
import InfoRow from './info-row'

type props = {
  applicationId: string
  onBack: () => void
} & deployT

function Details({ id, port, status, applicationId, onBack }: props) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [logLines, setLogLines] = useState(100)

  const updateDeployManager = useVMStore((s) => s.updateDeployManager)
  const vmDeployment = useVMStore((s) =>
    s.vms
      ?.find((v) => v.id === id)?.deployManager
      ?.find((d) => d.application_id === applicationId)
  )

  const {
    data: deployment,
    isLoading: isLoadingStatus,
    refetch: refetchStatus,
  } = useGetDeploymentStatus({ id, port, status, applicationId })

  const {
    data: logsData,
    isLoading: isLoadingLogs,
    refetch: refetchLogs,
    isError,
  } = useGetDeploymentLogs({ id, port, status, applicationId, lines: logLines })

  useEffect(() => {
    if (deployment?.status) {
      updateDeployManager(id, deployment.application_id, {
        status: deployment?.status,
      })
    }
  }, [deployment?.status])

  const stopMutation = useStopDeploy(id, port, applicationId)
  const startMutation = useRestartDeploy(id, port, applicationId, vmDeployment?.port)
  const undeployMutation = useUndeploy(id, port, applicationId)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await Promise.all([refetchStatus(), refetchLogs()])
    setIsRefreshing(false)
  }

  const disabled = isLoadingStatus || stopMutation.isPending || startMutation.isPending || undeployMutation.isPending || vmDeployment?.status === 'deploying'

  if (isLoadingStatus) {
    return (
      <div className='p-6'>
        <div className='animate-pulse space-y-6'>
          <div className='flex items-center justify-between mb-4'>
            <div className='h-6 w-40 bg-muted rounded' />
            <div className='h-8 w-24 bg-muted rounded' />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <div className='h-4 w-24 bg-muted rounded mb-1' />
                  <div className='h-6 w-48 bg-muted rounded' />
                </div>
              ))}
            </div>
            <div className='space-y-4'>
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <div className='h-4 w-32 bg-muted rounded mb-1' />
                  <div className='h-6 w-56 bg-muted rounded' />
                </div>
              ))}
            </div>
          </div>

          <div className='flex flex-col items-center justify-center pt-6 text-muted-foreground'>
            <Loader className='h-4 w-4 animate-spin mb-2' />
            <span className='text-sm text-center'>
              Fetching deployment details...
              <br />
              This may take a few seconds depending on application status.
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center mb-4'>
        <Button variant='ghost' onClick={onBack} className='mr-2'>
          <ArrowLeft className='h-4 w-4 mr-2' /> Back to List
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span className='flex items-center gap-2'>
              Deployment: <code className='font-mono'>{applicationId}</code>
              <GetStatus status={vmDeployment?.status} />
            </span>

            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={handleRefresh}
                disabled={isRefreshing}
                className='flex items-center gap-2'
              >
                {isRefreshing ? (
                  <>
                    <RefreshCw className='h-4 w-4 animate-custom-spin text-muted-foreground' />
                    <span className='text-muted-foreground'>Refreshing…</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className='h-4 w-4' />
                    Refresh
                  </>
                )}
              </Button>

              {deployment?.status === 'online' && (
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => window.electronAPI?.openExternal?.(`http://localhost:${vmDeployment?.port}`)}
                >
                  <ExternalLink className='h-4 w-4' />
                  Open App
                </Button>
              )}
            </div>
          </CardTitle>

          <CardDescription className='mt-2 break-words w-full max-w-[600px]'>
            {vmDeployment?.description || 'No repository URL set'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className='space-y-4'>
            <InfoRow title='Framework' value={vmDeployment?.framework || 'Unknown'} isBadge />
            <InfoRow title='Repository' value={vmDeployment?.repo_url || 'Repository URL not set'} isLink />
            <InfoRow title='Port' value={vmDeployment?.port ?? '—'} />
          </div>
        </CardContent>

        <CardFooter className='flex flex-wrap gap-3 border-t pt-6'>
          {
            deployment?.status === 'online' &&
            <Button
              variant='outline'
              onClick={() => stopMutation.mutate()}
              disabled={disabled}
            >
              {stopMutation.isPending ? (
                <Loader className='h-4 w-4 animate-spin' />
              ) : (
                <Square className='h-4 w-4' />
              )}
              Stop
            </Button>
          }

          {
            deployment?.status === 'stopped' &&
            <Button
              variant='outline'
              onClick={() => startMutation.mutate()}
              disabled={disabled}
            >
              {startMutation.isPending ? <Loader className='h-4 w-4 animate-spin' /> : <Play className='h-4 w-4' />}
              Start
            </Button>
          }

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant='destructive'
                disabled={disabled}
              >
                <Trash className='h-4 w-4' />
                Undeploy
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will completely remove the deployment and all its data. This action is irreversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => undeployMutation.mutate()}
                  className='bg-red-600 hover:bg-red-700'>
                  Undeploy
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deployment Logs</CardTitle>
          <CardDescription>View the latest logs for your deployment</CardDescription>
          <div className='mt-2 flex items-center gap-2'>
            <label htmlFor='log-lines' className='text-sm'>
              Lines to show:
            </label>
            <Input
              id='log-lines'
              type='number'
              className='w-24'
              value={logLines}
              onChange={(e) => setLogLines(parseInt(e.target.value, 10) || 100)}
            />
            <Button variant='outline' size='sm' onClick={() => refetchLogs()}>
              <RefreshCw className='h-4 w-4 mr-2' />
              Refresh Logs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className='h-[400px] rounded-md border p-4 bg-black'>
            {isLoadingLogs && !logsData ? (
              <div className='text-gray-400'>Loading logs...</div>
            ) : (
              <pre className='text-xs text-gray-300 font-mono whitespace-pre-wrap'>
                {logsData || 'No logs available.'}
              </pre>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {
        isError && (
          <Card className='border-red-300'>
            <CardHeader className='bg-red-50'>
              <CardTitle className='text-red-700'>Error</CardTitle>
            </CardHeader>
            <CardContent className='pt-4 bg-red-50'>
              <pre className='whitespace-pre-wrap text-red-700 text-sm'>{deployment?.error_message}</pre>
            </CardContent>
          </Card>
        )
      }
    </div>
  )
}

export default Details
