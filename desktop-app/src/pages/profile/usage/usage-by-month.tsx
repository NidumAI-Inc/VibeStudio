import { format } from 'date-fns'

import { useServerUsage } from '@/hooks/use-usage'
import { formatBytes } from '@/utils'
import useUIStore from '@/store/ui'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card } from '@/components/ui/card'

function UsageByMonth() {
  const close = useUIStore((s) => s.close)
  const open = useUIStore((s) => s.open)
  const data = useUIStore((s) => s.data)

  const { data: usages, isLoading, isError } = useServerUsage(data?.serverId, data?.type)

  return (
    <Dialog open={open === 'monthly-usage'} onOpenChange={close}>
      <DialogContent className='w-full max-w-[90vw] sm:max-w-4xl p-8 sm:p-8'>
        <DialogHeader className='mb-6'>
          <DialogTitle className='text-2xl'>Usage by month</DialogTitle>
          <DialogDescription className='text-base text-muted-foreground'>
            Monthly usage statistics for the server
          </DialogDescription>
        </DialogHeader>

        <Card className='max-h-[400px] p-6 overflow-auto'>
          <Table className='w-full text-sm'>
            <TableHeader className='sticky top-0 z-10'>
              <TableRow>
                <TableHead className='px-2 py-3'>Date</TableHead>
                <TableHead className='px-4 py-3'>Resource type</TableHead>
                <TableHead className='px-4 py-3'>Network in</TableHead>
                <TableHead className='px-4 py-3'>Network out</TableHead>
                <TableHead className='px-4 py-3 text-right'>Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5}>Loading...</TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={5}>Error loading usage data</TableCell>
                </TableRow>
              ) : (
                usages?.map((entry, idx) => (
                  <TableRow key={idx} className='border-t'>
                    <TableCell className='px-2 py-4 whitespace-nowrap'>
                      {format(new Date(entry.month), 'MMM yyyy')}
                    </TableCell>

                    <TableCell className='px-4 py-4 whitespace-nowrap'>
                      Compute
                    </TableCell>

                    <TableCell className='px-4 py-4 whitespace-nowrap'>
                      {formatBytes(entry.bandWidthIn * 1024 * 1024)}
                    </TableCell>

                    <TableCell className='px-4 py-4 whitespace-nowrap'>
                      {formatBytes(entry.bandWidthOut * 1024 * 1024)}
                    </TableCell>

                    <TableCell className='px-4 py-4 text-right whitespace-nowrap'>Free</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

export default UsageByMonth