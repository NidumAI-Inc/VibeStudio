import { ArrowUp, Trash } from 'lucide-react'

import type { portT } from '@/types/vm'
import { restartVm } from '@/actions/vm-manager'
import useVMStore from '@/store/vm'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

import ExposedInput from './exposed-input'
import AddPort from './add-port'

interface props {
  id: string
}

function NetworkConfig({ id }: props) {
  const updateVM = useVMStore((s) => s.updateVM)
  const vm = useVMStore((s) => s.vms.find((vm) => vm.id === id))

  const handleRemovePort = (port: number) => {
    updateVM(id, {
      ports: {
        ...vm?.ports,
        vm: (vm?.ports?.vm || []).filter((p) => p.internal !== port),
      },
    })
  }

  function onEdit(internal: number, newData: Partial<portT>) {
    updateVM(id, {
      ports: {
        ...vm?.ports,
        vm: (vm?.ports?.vm || []).map((p) => {
          if (p.internal === internal) {
            return {
              ...p,
              ...newData,
            }
          }

          return p
        }),
      },
    })
  }

  const renderPorts =
    false
      ? [
          {
            internal: 11434,
            exposed: 11434,
            enabled: true,
            editable: false,
            description: 'Ollama Server Port',
          },
        ]
      : vm?.ports?.vm?.filter((port) => ![3401, 6222].includes(port.internal))

  return (
    <div className='space-y-6'>
      <Card className='gap-3'>
        <CardHeader>
          <CardTitle className='text-lg'>Port Configuration</CardTitle>
        </CardHeader>

        <CardContent>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <div className='df gap-4 text-xs text-gray-400 ml-3'>
                <p className='w-20 ml-1'>Exposed</p>
                <p className='w-20'>Internal</p>
                <p className='flex-1 pl-2'>Description</p>
                <p>Enabled</p>
                <p className='w-7'></p>
              </div>

              {renderPorts?.map((port, i) => (
                <div key={i} className='df gap-4 p-2 bg-secondary/60 rounded-lg'>
                  <ExposedInput
                    value={port.exposed}
                    // onSave={(exposed) => onEdit(port.internal, { exposed })}
                    // disabled={!port.editable}
                    disabled={!port.editable}
                    onSave={(exposed) => onEdit(port.internal, { exposed })}
                    // disabled={true}
                  />
                  <span>:</span>
                  <p className='w-20'>{port.internal}</p>

                  <p className='flex-1'>{port.description || '-'}</p>

                  <Switch
                    checked={port.enabled}
                    onCheckedChange={(enabled) => onEdit(port.internal, { enabled })}
                    className='cursor-pointer'
                    disabled={!port.editable}
                  />

                  <Button
                    size='sm'
                    variant='destructive'
                    onClick={() => handleRemovePort(port.internal)}
                    disabled={!port.editable}
                    className='size-6 p-0 bg-destructive/60 hover:bg-destructive/80 rounded-sm disabled:opacity-50'>
                    <Trash className='size-3' />
                  </Button>
                </div>
              ))}

              {/* {vm?.ports?.vm
                ?.filter((port) => ![3401, 6222].includes(port.internal))
                ?.map((port, i) => (
                  <div key={i} className='df gap-4 p-2 bg-secondary/60 rounded-lg'>
                    <ExposedInput
                      value={port.exposed}
                      disabled={!port.editable}
                      onSave={(exposed) => onEdit(port.internal, { exposed })}
                    />
                    <span>:</span>
                    <p className='w-20'>{port.internal}</p>

                    <p className='flex-1'>{port.description || '-'}</p>

                    <Switch
                      checked={port.enabled}
                      onCheckedChange={(enabled) => onEdit(port.internal, { enabled })}
                      className='cursor-pointer'
                      disabled={!port.editable}
                    />

                    <Button
                      size='sm'
                      variant='destructive'
                      onClick={() => handleRemovePort(port.internal)}
                      disabled={!port.editable}
                      className='size-6 p-0 bg-destructive/60 hover:bg-destructive/80 rounded-sm disabled:opacity-50'>
                      <Trash className='size-3' />
                    </Button>
                  </div>
                ))} */}
            </div>

            <AddPort id={id} />
          </div>
        </CardContent>
      </Card>

      {vm?.status === 'running' && vm.needRestart && (
        <div className='flex justify-end'>
          <Button onClick={() => restartVm(id, vm)} className='bg-primary hover:bg-primary/90'>
            <ArrowUp className='h-4 w-4 mr-2' />
            Restart Server
          </Button>
        </div>
      )}
    </div>
  )
}

export default NetworkConfig
