import { useEffect } from 'react'
import { Check, ExternalLink, Globe, Info, Loader, StopCircle, Trash2 } from 'lucide-react'

import type { domainT } from '@/types/vm'
import { useDeleteDomain, useGetDomain, useStart, useStop } from '@/hooks/use-frpc'
import useVMStore from '@/store/vm'

import { LiveWave } from '@/components/ui/live-wave'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Props {
  id: string
}

function Row({ vmId, config }: { vmId: string; config: domainT }) {
  const updateDomain = useVMStore((s) => s.updateDomain)

  const { data } = useGetDomain(config?.domain, config.isVerifying)

  const { mutate: start, isPending: startPending } = useStart()
  const { mutate: stop, isPending: stopPending } = useStop()
  const { mutate: deleteDomain, isPending } = useDeleteDomain()

  useEffect(() => {
    if (data?.verified) {
      updateDomain(vmId, config?.id, {
        isVerified: true,
        isVerifying: false,
      })
    }
  }, [data, vmId, config?.id])

  return (
    <div className='border border-border rounded-lg bg-card text-foreground shadow-xs p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
      <div className='flex flex-col gap-1 text-sm'>
        <div className='flex items-center gap-2 text-base font-medium break-all'>
          <Globe className='h-4 w-4 text-primary flex-shrink-0' />
          <div className='flex-1'>
            <input
              type='text'
              readOnly
              value={config?.domain}
              className='w-full px-3 py-1.5 border border-border rounded-md text-sm bg-muted/30 text-foreground cursor-default'
              onBlur={() => {
                const domain = config?.domain?.toLowerCase()?.trim()
                if (domain.startsWith('http://') || domain.startsWith('https://')) {
                  toast.error(
                    'Invalid domain format. Please remove "http://" or "https://" and enter only the domain name.'
                  )
                }
              }}
            />
          </div>

          {config?.isVerified ? (
            <div className='flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs'>
              <Check className='h-3 w-3 mr-1' />
              Verified
            </div>
          ) : (
            <div className='flex items-center px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs'>
              <Info className='h-3 w-3 mr-1' />
              Pending
            </div>
          )}
        </div>
        <span className='text-muted-foreground'>Port: {config?.port}</span>
      </div>

      <div className='flex items-center gap-2'>
        {!config?.isVerified && (
          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              const domain = config?.domain?.toLowerCase()?.trim()
              if (domain.startsWith('http://') || domain.startsWith('https://')) {
                toast.error('Verification failed: protocols like "http://" or "https://" are not allowed.')
                return
              }
              updateDomain(vmId, config?.id, { isVerifying: true })
            }}
            disabled={config?.isVerifying}>
            {config?.isVerifying ? (
              <>
                <Loader className='h-3 w-3 mr-1 animate-spin' />
                Verifying...
              </>
            ) : (
              'Verify'
            )}
          </Button>
        )}

        {config?.isVerified && (
          <>
            {config.isRunning ? (
              <>
                <Button
                  variant='outline'
                  title='Open public URL'
                  className='w-28 text-green-600 bg-green-100 font-medium text-sm h-8 px-4 rounded-md'
                  onClick={() => window.electronAPI?.openExternal?.(`https://${config?.domain}`)}>
                  <LiveWave size={6} />
                  <span className='ml-2'>Live</span>
                  <ExternalLink className='w-4 h-4 ml-1 opacity-70' />
                </Button>

                <Button
                  size='sm'
                  variant='destructive'
                  onClick={() =>
                    stop({
                      vmId,
                      id: config?.id,
                    })
                  }
                  disabled={stopPending}>
                  {stopPending ? (
                    <Loader className='animate-spin h-3 w-3 text-muted-foreground ml-auto' />
                  ) : (
                    <StopCircle className='w-4 h-4' />
                  )}
                  Stop
                </Button>
              </>
            ) : (
              <Button
                size='sm'
                onClick={() =>
                  start({
                    domain: config?.domain,
                    port: config?.port,
                    vmId,
                    id: config?.id,
                  })
                }
                disabled={startPending}
                className='w-28'>
                {startPending ? (
                  <Loader className='animate-spin h-3 w-3 text-muted-foreground ml-auto dark:text-black/50' />
                ) : (
                  <Globe className='w-4 h-4 mr-1' />
                )}
                Go Public
              </Button>
            )}
          </>
        )}

        <Button
          size='sm'
          variant='destructive'
          onClick={() =>
            deleteDomain({
              vmId,
              id: config?.id,
              domain: config?.domain,
            })
          }
          disabled={isPending}>
          {stopPending ? (
            <Loader className='animate-spin h-3 w-3 text-muted-foreground ml-auto' />
          ) : (
            <Trash2 className='w-4 h-4' />
          )}
          Delete
        </Button>
      </div>
    </div>
  )
}

function DomainList({ id }: Props) {
  const domains = useVMStore((s) => s.vms?.find((v) => v.id === id)?.domains)

  if (!domains || domains.length === 0) return null

  return (
    <div className='space-y-4 mx-auto mb-6'>
      {domains.map((config) => (
        <Row key={config?.id} vmId={id} config={config} />
      ))}
    </div>
  )
}

export default DomainList
