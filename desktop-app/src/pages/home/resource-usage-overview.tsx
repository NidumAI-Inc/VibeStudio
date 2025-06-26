import { getProgressColor } from '@/utils'
import { useSystemStatus } from '@/hooks/use-system-status'

import { Card, CardContent } from '@/components/ui/card'
import ColoredPercentage from '@/components/ui/colored-percentage'
import { Progress } from '@/components/ui/progress'

function ResourceUsageOverview() {
  const { data: systemStatus } = useSystemStatus()

  return (
    <Card className='mb-6'>
      <CardContent>
        <div className='flex justify-between items-start mb-4'>
          <div>
            <h3 className='text-lg font-semibold'>Resource Usage Overview</h3>
            <p className='text-sm text-muted-foreground'>Real-time monitoring of your resources</p>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='space-y-2'>
            <p className='text-sm text-muted-foreground'>Total CPU Usage</p>
            <p className='text-2xl font-semibold'>{systemStatus?.cpuUsage}%</p>
            <div className='flex items-center gap-2'>
              <div className='w-[85%]'>
                <Progress
                  value={parseFloat(systemStatus?.cpuUsage ?? '0')}
                  className="resource-bar h-1.5"
                  barClassName={getProgressColor(parseFloat(systemStatus?.cpuUsage ?? '0'))}
                />
              </div>

              <div className='w-[15%] flex justify-start'>
                <ColoredPercentage value={parseFloat(systemStatus?.cpuUsage ?? '0')} />
              </div>
            </div>
          </div>

          {/* RAM Usage */}
          <div className='space-y-2'>
            <p className='text-sm text-muted-foreground'>Total RAM Usage</p>
            <p className='text-2xl font-semibold flex items-baseline gap-2'>
              {systemStatus?.ram.used} / {systemStatus?.ram.total} GB
            </p>

            <div className='flex items-center gap-2'>
              <div className='w-[85%]'>
                <Progress
                  value={systemStatus?.ram.percentage ?? 0}
                  className="resource-bar h-1.5"
                  barClassName={getProgressColor(systemStatus?.ram.percentage ?? 0)}
                />
              </div>

              <div className='w-[15%] flex justify-start'>
                <ColoredPercentage value={systemStatus?.ram.percentage ?? 0} />
              </div>
            </div>
          </div>

          {/* Disk Usage */}
          <div className='space-y-2'>
            <p className='text-sm text-muted-foreground'>Total Disk Usage</p>
            <p className='text-2xl font-semibold flex items-baseline gap-2'>
              {systemStatus?.disk.used} / {systemStatus?.disk.total} GB
            </p>

            <div className='flex items-center gap-2'>
              <div className='w-[85%]'>
                <Progress
                  value={systemStatus?.disk.percentage ?? 0}
                  className="resource-bar h-1.5"
                  barClassName={getProgressColor(systemStatus?.disk.percentage ?? 0)}
                />
              </div>
              <div className='w-[15%] flex justify-start'>
                <ColoredPercentage value={systemStatus?.disk.percentage ?? 0} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ResourceUsageOverview
