import { Loader, Network } from 'lucide-react'

import type { UsageOverview } from '@/actions/usage'
import { formatBytes } from '@/utils'

import useVMNamesStore from '@/store/vm-names'
import useUIStore from '@/store/ui'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import UsageByMonth from './usage-by-month'
import Icon from './icon'

interface ServerUsageTableProps {
  data: UsageOverview[]
  isLoading: boolean
  description?: string
  selectedView: 'nativenode' | 'domain'
  onChangeView: (view: 'nativenode' | 'domain') => void
}

function ServerUsageTable({ data, isLoading, description, selectedView, onChangeView }: ServerUsageTableProps) {
  const vmNames = useVMNamesStore((s) => s.list)
  const update = useUIStore((s) => s.update)
  const open = useUIStore((s) => s.open)

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Network className='h-5 w-5' />
            <span className='text-lg font-medium'>{selectedView == 'nativenode' ? 'Native Node' : 'Domain'}</span>
          </div>

          <Select value={selectedView} onValueChange={(v) => onChangeView(v as 'nativenode' | 'domain')}>
            <SelectTrigger className='w-[200px]'>
              <SelectValue placeholder='Select view' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='nativenode'>Native Node</SelectItem>
              <SelectItem value='domain'>Domain</SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>

        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='px-4 py-3'>Server</TableHead>
              <TableHead className='px-4 py-3'>Network In</TableHead>
              <TableHead className='px-4 py-3'>Network Out</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3} className='h-60 dc text-center'>
                  <Loader className='animate-spin' />
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              data?.map((server) => (
                <TableRow
                  key={server.serverId}
                  onClick={() =>
                    update({ open: 'monthly-usage', data: { serverId: server.serverId, type: selectedView } })
                  }
                  className='cursor-pointer even:bg-muted/10 hover:bg-muted/20 transition-colors'>
                  <TableCell className='px-4 py-3'>
                    <div className='flex items-center gap-3'>
                      <Icon type='server' />
                      <div className='flex flex-col'>
                        <span className='font-medium text-sm truncate'>
                          {vmNames?.[server?.serverId] || server.serverId}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className='px-4 py-3'>
                    <span className='font-medium'>{formatBytes(server.totalBandWidthIn * 1024 * 1024)}</span>
                  </TableCell>

                  <TableCell className='px-4 py-3'>
                    <span className='font-medium'>{formatBytes(server.totalBandWidthOut * 1024 * 1024)}</span>
                  </TableCell>
                </TableRow>
              ))}

            {data?.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={3} className='h-60 text-center'>
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {open === 'monthly-usage' && <UsageByMonth />}
    </Card>
  )
}

export default ServerUsageTable
