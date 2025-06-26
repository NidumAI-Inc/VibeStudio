import { useNavigate } from 'react-router-dom'
import { Database, Code, Box, TerminalIcon, Info } from 'lucide-react'

import { getStatusColor, getVMIcon } from '@/utils'
import type { VM } from '@/types/vm'
import useUIStore from '@/store/ui'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import ResourceUsage, { CpuUsage, MemoryUsage, StorageUsage } from './resource-usage'
import StatusButton from './status-btn'
// import Features from './features';
import Actions from './actions'

interface VMCardProps {
  vm: VM
  onAction: (action: 'start' | 'stop' | 'delete' | 'terminal' | 'monitor') => void
  viewMode?: 'grid' | 'list'
}

function VMCard({ vm, onAction, viewMode = 'grid' }: VMCardProps) {
  const updateModel = useUIStore((s) => s.update)
  const navigate = useNavigate()

  const statusColor = getStatusColor(vm?.status)
  const iconType = getVMIcon(vm?.type)

  const handleCardClick = () => navigate(`/vm/${vm?.id}`)

  function onOpenTerminal() {
    updateModel({
      open: 'terminal',
      data: { vmName: vm?.name, id: vm?.id },
    })

    if (vm?.status === 'running') {
      window.electronAPI.vmInput(vm?.id, '\r\n')
    }
  }

  const renderIcon = () => {
    switch (iconType) {
      case 'database':
        return <Database className='h-5 w-5 text-emerald-500' />
      case 'code':
        return <Code className='h-5 w-5 text-blue-500' />
      default:
        return <Box className='h-5 w-5 text-blue-500' />
    }
  }

  if (viewMode === 'list') {
    return (
      <Card
        className='vm-card hover-lift py-0 shadow-sm cursor-pointer overflow-hidden rounded-md'
        onClick={handleCardClick}>
        <div className='df p-4'>
          <div className='shrink-0 bg-primary/10 p-2 rounded-full'>{renderIcon()}</div>

          <div className='w-28 md:w-40 shrink-0'>
            <h3 className='text-base font-semibold tracking-tight line-clamp-1'>{vm.name}</h3>
            <div className='flex items-center text-xs text-muted-foreground mt-1'>
              <div className={`pulse-dot ${statusColor} before:${statusColor}`}>
                <div className={`h-full w-full rounded-full ${statusColor}`}></div>
              </div>
              <span className='capitalize mr-2'>{vm.status}</span>
            </div>
          </div>

          <div className='w-20 shrink-0'>
            <p className='text-xs text-muted-foreground'>Type</p>
            <p className='text-sm capitalize line-clamp-1'>{vm.type}</p>
          </div>

          <div className='w-24 shrink-0'>
            <p className='text-xs text-muted-foreground'>IP</p>
            <p className='text-sm line-clamp-1'>{vm.ipAddress || 'Not assigned'}</p>
          </div>

          <div className='hidden md:grid grid-cols-3 items-center gap-8 md:px-8 flex-1 overflow-hidden'>
            <CpuUsage
              isMini
              id={vm.id}
              port={vm.ports.glance.exposed}
              status={vm.status}
              isRunning={vm.status === 'running'}
            />
            <MemoryUsage
              isMini
              id={vm.id}
              port={vm.ports.glance.exposed}
              status={vm.status}
              isRunning={vm.status === 'running'}
            />
            <StorageUsage
              isMini
              id={vm.id}
              port={vm.ports.glance.exposed}
              status={vm.status}
              isRunning={vm.status === 'running'}
            />
          </div>

          <div className='df gap-4 ml-auto md:ml-4 shrink-0'>
            {/* <div className="gap-1 hidden md:flex">
              {vm.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {vm.tags.length > 2 && <Badge variant="outline" className="text-xs">+{vm.tags.length - 2}</Badge>}
            </div> */}

            <StatusButton size='sm' status={vm?.status} onAction={onAction} className='h-8 w-28' />

            <Button
              size='sm'
              onClick={(e) => {
                e.stopPropagation()
                onOpenTerminal()
              }}
              variant='default'
              className='h-8'>
              <TerminalIcon className='h-4 w-4' />
            </Button>

            <Actions
              type={vm.type}
              onAction={(action) => {
                if (action === 'terminal') {
                  onOpenTerminal()
                } else {
                  onAction(action)
                }
              }}
            />
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className='vm-card hover-lift py-0 shadow-sm cursor-pointer rounded-md' onClick={handleCardClick}>
      <CardHeader className='p-4 pb-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='bg-primary/10 p-2 rounded-full'>{renderIcon()}</div>

            <div>
              <h3 className='text-base font-semibold tracking-tight'>{vm?.name}</h3>
              <div className='flex items-center text-xs text-muted-foreground mt-1'>
                <div className={`pulse-dot ${statusColor} before:${statusColor}`}>
                  <div className={`h-full w-full rounded-full ${statusColor}`}></div>
                </div>

                <span className='capitalize mr-2'>{vm?.status}</span>
              </div>
            </div>
          </div>

          <Actions
            type={vm.type}
            onAction={(action) => {
              if (action === 'terminal') {
                onOpenTerminal()
              } else {
                onAction(action)
              }
            }}
          />
        </div>

        <div className='mt-2 flex flex-wrap gap-1'>
          {vm?.tags.map((tag) => (
            <Badge key={tag} variant='secondary' className='text-xs'>
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className='p-4 pt-2'>
        <div className='grid grid-cols-2 gap-4 text-sm mb-4'>
          <div>
            <p className='text-muted-foreground'>Status</p>
            <p className='capitalize'>{vm?.status}</p>
          </div>
          <div>
            <p className='text-muted-foreground'>IP Address</p>
            <p>127.0.0.1</p>
            {/* vm?.ipAddress || */}
          </div>
          <div>
            <p className='text-muted-foreground'>OS</p>
            <p>{vm?.os}</p>
          </div>
          <div>
            <p className='text-muted-foreground'>Version</p>
            <p>{vm?.version}</p>
          </div>
        </div>

        {/* {vm?.features && <Features features={vm?.features} />} */}

        <ResourceUsage id={vm?.id} port={vm?.ports?.glance?.exposed} status={vm?.status} />
      </CardContent>

      <CardFooter className='p-4 pt-2 grid grid-cols-2 gap-2'>
        <Button
          variant='outline'
          onClick={(e) => {
            e.stopPropagation()
            handleCardClick()
          }}>
          <Info />
          More Info
        </Button>

        <StatusButton status={vm?.status} onAction={onAction} variant='default' />

        {/* <Button
          onClick={(e) => {
            e.stopPropagation()
            onOpenTerminal()
          }}>
          <TerminalIcon className='h-4 w-4' />
          Terminal
        </Button> */}
      </CardFooter>
    </Card>
  )
}

export default VMCard
