import { Activity, Clock, FileText, Server, TerminalIcon, Trash2 } from 'lucide-react'
// TODO: Replace with custom icons from assets when available
// import terminalIcon from '@/assets/imgs/terminal.png'
// import monitorIcon from '@/assets/imgs/monitor.png'
// import deleteIcon from '@/assets/imgs/delete.png'
import { useNavigate, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { toast } from 'sonner'

import { getStatusColor } from '@/utils'
import { startVm, stopVm } from '@/actions/vm-manager'
import useVMStore from '@/store/vm'
import useUIStore from '@/store/ui'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import TerminalDialog from '@/components/terminal/terminal-dialog'
import ResourceUsage from '@/pages/home/card/resource-usage'
import StatusButton from '../home/card/status-btn'
import VmMonitor from '@/components/models/vm-monitor'
import Nav from '@/components/home-wrapper/nav'
import DeleteVm from '@/pages/home/delete-vm'

import NetworkConfig from './network-config'
import DomainConfig from './domain-config'
import TunnelConfig from './tunnel-config'
import FileSystem from './file-system'
import EnvConfig from './env-config'
import VibeCodingExternalInfo from './vibe-coding-info'

function VMDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const vm = useVMStore((s) => s.vms.find((v) => v.id === id))
  const showDocumentation = false

  const tabs = showDocumentation
    ? [
        {
          value: 'overview',
          label: 'Server Info',
          icon: Activity,
        },
        {
          value: 'network',
          label: 'Network',
          icon: Server,
        },
        {
          value: 'documentation',
          label: 'Documentation',
          icon: FileText,
        },
      ]
    : [
        {
          value: 'overview',
          label: 'Server Info',
          icon: Activity,
        },
        {
          value: 'network',
          label: 'Network',
          icon: Server,
        },
        {
          value: 'filesystem',
          label: 'Files',
          icon: FileText,
        },
      ]

  if (showDocumentation) {
    tabs.length = 0
    tabs.push(
      {
        value: 'overview',
        label: 'Overview',
        icon: Activity,
      },
      {
        value: 'network',
        label: 'Network & Domain',
        icon: Server,
      },
      {
        value: 'documentation',
        label: 'Documentation',
        icon: FileText,
      }
    )
  }

  const updateModel = useUIStore((s) => s.update)
  const open = useUIStore((s) => s.open)

  const statusColor = getStatusColor(vm.status)

  const onOpenTerminal = () => {
    updateModel({
      open: 'terminal',
      data: { vmName: vm?.name, id: vm?.id },
    })
  }

  const onDeleteVm = () => {
    updateModel({
      open: 'delete-vm',
      data: vm,
    })
  }


  function openMonitor() {
    if (vm?.status !== 'running') {
      toast.warning('Server must be running to Monitor, Click on "Terminal" button.', {
        position: 'bottom-right',
      })
      return
    }

    updateModel({
      open: 'vm-monitor',
      data: { id: vm?.id, port: vm?.ports.glance.exposed },
    })
  }

  function onAction(action: string) {
    if (action === 'start') {
      startVm(vm)
    } else if (action === 'stop') {
      stopVm(vm?.id)
    }
  }

  if (!vm) {
    return (
      <div className='min-h-screen bg-secondary p-8'>
        <div className='text-center mt-8'>Server not found</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background'>
      <Nav />
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8'>
        <Card className='mb-8 p-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-3'>
                <div className={`h-4 w-4 rounded-full ${statusColor}`}></div>
                <div>
                  <h1 className='text-2xl font-bold'>{vm?.name}</h1>
                  <p className='text-sm text-muted-foreground capitalize'>Status: {vm.status}</p>
                </div>
              </div>
            </div>

            <div className='flex gap-2'>
              {vm?.status === 'running' && (
                <Button 
                  size="lg"
                  className='bg-orange-500 hover:bg-orange-600 text-white'
                  onClick={() => {
                    window.electronAPI.openExternal('https://app.vibestud.io')
                  }}
                >
                  <Activity className='h-4 w-4 mr-2' />
                  Open app.vibestud.io
                </Button>
              )}
              <StatusButton status={vm.status} onAction={onAction} />
              <Button variant='outline' onClick={onOpenTerminal}>
                <TerminalIcon className='h-4 w-4' />
                Terminal
              </Button>
              <Button variant='outline' onClick={openMonitor}>
                <Activity className='h-4 w-4' />
                Monitor
              </Button>
              <Button variant='outline' onClick={onDeleteVm} className='text-red-500 hover:text-red-600 hover:bg-red-50'>
                <Trash2 className='h-4 w-4' />
                Delete
              </Button>
            </div>
          </div>
        </Card>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          <div className='lg:col-span-3 space-y-6'>

            <Tabs defaultValue='overview' className='w-full'>
              <TabsList className='w-full h-12 bg-muted/40 rounded-xl '>
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className='h-8 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg m-1 cursor-pointer'>
                    <tab.icon className='h-4 w-4 mr-2' />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value='overview' className='space-y-6'>
                <Card className='p-6'>
                  <h3 className='text-lg font-semibold mb-4'>Server Status</h3>
                  <ResourceUsage id={vm?.id} port={vm?.ports.glance.exposed} status={vm?.status} />
                </Card>

                {vm?.configFilePath && (
                  <EnvConfig
                    id={vm?.id}
                    port={vm?.ports.fs_api.exposed}
                    type={vm?.type}
                    title={vm?.name}
                    envPath={vm?.configFilePath}
                  />
                )}
              </TabsContent>

              <TabsContent value='network' className='space-y-6'>
                <Card className='p-6'>
                  <h3 className='text-lg font-semibold mb-4'>Network Settings</h3>
                  <NetworkConfig id={vm?.id} />
                </Card>
                
                <Card className='p-6'>
                  <h3 className='text-lg font-semibold mb-4'>External Access</h3>
                  <TunnelConfig vmId={vm?.id} />
                  <div className='mt-4'>
                    <VibeCodingExternalInfo />
                  </div>
                </Card>
                
                <Card className='p-6'>
                  <h3 className='text-lg font-semibold mb-4'>Domain Settings</h3>
                  <DomainConfig id={vm?.id} />
                </Card>
              </TabsContent>

              <TabsContent value='filesystem' className='h-full'>
                <Card className='p-6'>
                  <h3 className='text-lg font-semibold mb-4'>File Manager</h3>
                  <FileSystem id={vm?.id} port={vm?.ports.fs_api.exposed} status={vm?.status} />
                </Card>
              </TabsContent>

            </Tabs>
          </div>

          <div className='space-y-6'>
            <Card className='p-6'>
              <h3 className='text-lg font-semibold mb-4'>Server Info</h3>
              <div className='space-y-4'>
                <div>
                  <p className='text-sm text-muted-foreground'>Status</p>
                  <div className='flex items-center mt-1'>
                    <div className={`h-3 w-3 rounded-full ${statusColor} mr-2`}></div>
                    <p className='font-medium capitalize'>{vm.status}</p>
                  </div>
                </div>

                {vm?.status === 'running' && (
                  <div>
                    <p className='text-sm text-muted-foreground'>Local Server</p>
                    <code className='text-xs bg-muted px-2 py-1 rounded block mt-1'>
                      localhost:{vm?.ports.vm[0].exposed}
                    </code>
                  </div>
                )}

                <div>
                  <p className='text-sm text-muted-foreground'>Web App</p>
                  <code className='text-xs bg-muted px-2 py-1 rounded block mt-1'>
                    app.vibestud.io
                  </code>
                </div>

                <div>
                  <p className='text-sm text-muted-foreground'>Created</p>
                  <p className='font-medium'>{format(new Date(vm.createdAt), 'MMM d, yyyy')}</p>
                </div>

                {vm.lastStartedAt && (
                  <div>
                    <p className='text-sm text-muted-foreground'>Last Used</p>
                    <p className='font-medium'>{format(new Date(vm?.lastStartedAt), 'MMM d, HH:mm')}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {open === 'terminal' && <TerminalDialog />}
      {open === 'vm-monitor' && <VmMonitor />}
      {open === 'delete-vm' && <DeleteVm />}
    </div>
  )
}

export default VMDetails
