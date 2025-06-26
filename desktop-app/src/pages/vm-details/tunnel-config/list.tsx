import { useState } from 'react'
import { Loader, X } from 'lucide-react'

import { useStopTunnelMutate, useTunnelReserveMutate } from '@/hooks/use-tunnel'
import { generateURLSafeId } from '@/utils'
import useVMStore from '@/store/vm'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { Button } from '@/components/ui/button'

import TroubleshootDialog from '@/components/models/tunnel-trouble-shoot-modal'
import PortPublicRow from './port-public-row'

function List({ id }: { id: string }) {
  const addTunnel = useVMStore((s) => s.addTunnel)

  const tunnels = useVMStore((store) => store?.vms?.find((v) => v?.id === id)?.tunnel)
  const vm = useVMStore((s) => s.vms.find((v) => v.id === id))

  const { mutate: reserveTunnel } = useTunnelReserveMutate()
  const { mutate: stopTunnel, isPending: isStopping } = useStopTunnelMutate()

  const [nextSelect, setNextSelect] = useState<string>('')

  const exposedPorts =
    vm?.ports?.vm
      ?.map((p) => p.exposed)
      .filter((port) => ![3401, 6222].includes(port))
      .map(String) || []

  const handleAddPort = () => {
    if (!nextSelect) return

    const randomId = generateURLSafeId()
    reserveTunnel(
      {
        id: randomId,
        port: Number(nextSelect),
      },
      {
        onSuccess() {
          setNextSelect('')
          addTunnel(id, {
            id: randomId,
            port: Number(nextSelect),
            url: `https://${randomId}.link.nativenode.host`,
            is_public: false,
          })
        },
      }
    )
  }

  return (
    <>
      <div className='df absolute top-0 right-8'>
        <TroubleshootDialog />

        {tunnels?.some((t) => t.is_public) && (
          <Button
            variant='destructive'
            className='h-9 px-4 text-sm font-medium flex items-center justify-center gap-2'
            onClick={() => stopTunnel()}
            disabled={isStopping}>
            {isStopping ? <Loader className='w-4 h-4 animate-spin' color='white' /> : <X className='w-4 h-4' />}
            {isStopping ? 'Stopping...' : 'Stop All'}
          </Button>
        )}
      </div>

      <div className='flex items-center gap-3'>
        <Select onValueChange={setNextSelect} value={nextSelect}>
          <SelectTrigger className='w-[140px] cursor-pointer'>
            <SelectValue placeholder='Select Port' />
          </SelectTrigger>
          <SelectContent>
            {exposedPorts.map((port) => (
              <SelectItem key={port} value={port}>
                {port}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          size='sm'
          onClick={handleAddPort}
          disabled={!nextSelect}
          className={!nextSelect ? 'cursor-not-allowed opacity-50' : ''}>
          Add Port
        </Button>
      </div>

      {tunnels?.length > 0 && (
        <div className='space-y-6'>
          {tunnels?.map((tunnel) => (
            <PortPublicRow
              id={tunnel?.id}
              key={tunnel?.id}
              port={tunnel?.port}
              tunnelUrl={tunnel?.url || ''}
              isPublic={!!tunnel?.is_public}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default List
