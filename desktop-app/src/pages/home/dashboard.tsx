import { useState } from 'react'
import { BarChart2, Download, Grid3X3, Plus, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import type { VM } from '@/types/vm'
import { startVm, stopVm } from '@/actions/vm-manager'
import useDownloadQueue from '@/hooks/use-download-queue'
import useVMStore from '@/store/vm'
import useUIStore from '@/store/ui'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import ResourceUsageOverview from './resource-usage-overview'
import DownloadProgressModal from './download-progress-modal'
import TerminalDialog from '@/components/terminal/terminal-dialog'
import VmMonitor from '@/components/models/vm-monitor'
import DeleteVm from './delete-vm'
import Empty from './empty'
import Card from './card'

function Dashboard() {
  const navigate = useNavigate()
  const updateModel = useUIStore((s) => s.update)
  const open = useUIStore((s) => s.open)

  const vms = useVMStore((s) => s.vms)

  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showDownloads, setShowDownloads] = useState(false)

  const { progressMap } = useDownloadQueue()
  const hasDownloads = Object.keys(progressMap).length > 0

  const handleAction = (action: string, vm: VM) => {
    if (action === 'start') {
      startVm(vm)
    } else if (action === 'stop') {
      stopVm(vm?.id)
    } else if (action === 'delete') {
      updateModel({
        open: 'delete-vm',
        data: { name: vm?.name, id: vm?.id, diskUrl: vm?.diskUrl, type: vm?.type },
      })
    } else if (action === 'monitor') {
      updateModel({
        open: 'vm-monitor',
        data: { id: vm?.id, port: vm?.ports.glance.exposed },
      })
    }
  }

  const filteredVMs = vms
    .filter((vm) => {
      const matchesSearch =
        vm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vm.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vm.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (vm.projectType && vm.projectType.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesStatus = statusFilter === 'all' || vm.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => (new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() ? -1 : 1))

  if (vms.length === 0 && Object.keys(progressMap).length === 0) {
    return <Empty />
  }

  return (
    <div className='space-y-6'>
      <ResourceUsageOverview />

      <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
        <div className='relative flex-1 bg-input/10 text-foreground rounded-md border border-border'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search Servers by name, type, or tags…'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-9 bg-inherit text-foreground placeholder:text-muted-foreground border border-border focus-visible:ring-ring focus-visible:outline-none'
          />
        </div>

        <div className='flex gap-2'>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className='w-[120px] bg-white/70 cursor-pointer'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Status</SelectItem>
              <SelectItem value='running'>Running</SelectItem>
              <SelectItem value='stopped'>Stopped</SelectItem>
              <SelectItem value='error'>Error</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='df bg-muted/40 rounded-md'>
          <Button
            variant={viewMode === 'grid' ? 'outline' : 'ghost'}
            size='sm'
            className='h-8 px-2 border'
            onClick={() => setViewMode('grid')}>
            <Grid3X3 className='h-4 w-4' />
          </Button>

          <Button
            variant={viewMode === 'list' ? 'outline' : 'ghost'}
            size='sm'
            className='h-8 px-2 border'
            onClick={() => setViewMode('list')}>
            <BarChart2 className='h-4 w-4 rotate-90' />
          </Button>
        </div>

        <Button className='flex-shrink-0 bg-primary hover:bg-primary/90' onClick={() => navigate('/create-vm')}>
          <Plus className='h-4 w-4' />
          New Server
        </Button>
      </div>

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
        {filteredVMs.map((vm) => (
          <Card vm={vm} key={vm.id} viewMode={viewMode} onAction={(action) => handleAction(action, vm)} />
        ))}
      </div>

      {open === 'terminal' && <TerminalDialog />}
      {open === 'delete-vm' && <DeleteVm />}
      {open === 'vm-monitor' && <VmMonitor />}

      <div className='fixed bottom-6 right-6 z-[2] flex flex-col items-end gap-2'>
        <button
          onClick={() => setShowDownloads((prev) => !prev)}
          className='relative bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-4 shadow-lg'>
          <Download className='h-5 w-5' />
          {hasDownloads && (
            <span className='absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full px-1 text-xs font-bold'>
              {Object.keys(progressMap).length}
            </span>
          )}
        </button>

        {showDownloads && <DownloadProgressModal onClose={() => setShowDownloads(false)} />}
      </div>
    </div>
  )
}

export default Dashboard
