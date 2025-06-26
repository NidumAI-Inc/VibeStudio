import { useState } from 'react'
import { Loader2, MonitorSmartphone, BarChart2 } from 'lucide-react'

import useUIStore from '@/store/ui'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useGlancesMonitor } from '@/hooks/use-glance-monitor'
import MetricsGraph from './vm-log-metrics'
import { Button } from '../ui/button'

function VmMonitor() {
  const close = useUIStore((s) => s.close)
  const data = useUIStore((s) => s.data)
  const open = useUIStore((s) => s.open)

  // console.log(data?.port, data?.id)

  const [loading, setLoading] = useState(true)
  const [showGraph, setShowGraph] = useState(false)

  const { cpuData, memData, speed } = useGlancesMonitor(showGraph ? 1000 : 0)

  const parseSpeed = (speed: string) => {
    const value = parseFloat(speed)
    return isNaN(value) ? 0 : value
  }

  return (
    <Dialog open={open === 'vm-monitor'} onOpenChange={close}>
      <DialogContent
        aria-describedby='vm monitor dialog box'
        className='w-screen h-screen max-w-screen sm:max-w-screen flex flex-col rounded-none'>
        <DialogHeader className='flex flex-row items-center justify-between'>
          <div>
            <DialogTitle>Monitor</DialogTitle>
            <DialogDescription className='sr-only'>Monitor your server resources and performance.</DialogDescription>
          </div>
          <Button
            onClick={() => setShowGraph((prev) => !prev)}
            className={`
              inline-flex items-center gap-2 px-4 py-1.5 mr-6 rounded-md border text-sm font-medium transition-colors
              border-border
              ${
                showGraph
                  ? 'bg-[hsl(var(--chart-1)/0.1)] text-[hsl(var(--chart-1))] hover:bg-[hsl(var(--chart-1)/0.2)]'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }
              dark:border-border
            `}
            aria-pressed={showGraph}
            type='button'>
            <BarChart2 className='w-5 h-5' style={showGraph ? { color: 'hsl(var(--chart-1))' } : {}} />
            {showGraph ? 'Hide Metrics in Graph' : 'Show Metrics in Graph'}
          </Button>
        </DialogHeader>

        {loading && !showGraph && (
          <div className='dc flex-col gap-4 h-full'>
            <MonitorSmartphone className='w-12 h-12 text-primary animate-pulse' />
            <p className='text-base text-foreground font-medium'>Connecting to Server Monitor...</p>
            <Loader2 className='w-5 h-5 animate-spin text-muted-foreground' />
          </div>
        )}

        {!showGraph && data.port && (
          <iframe
            className='h-full w-full flex-1'
            src={`http://localhost:${data.port}`}
            onLoad={() => setLoading(false)}
          />
        )}

        {showGraph && (
          <div className='flex-1 overflow-auto p-4'>
            <MetricsGraph
              cpuData={cpuData}
              memData={memData}
              netData={{
                download: parseSpeed(speed.download),
                upload: parseSpeed(speed.upload),
              }}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default VmMonitor
