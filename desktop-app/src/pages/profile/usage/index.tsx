import { useState } from 'react'

import { useOverviewUsage } from '@/hooks/use-usage'

import ServerUsageTable from './server-usage-table'

function NetworkUsagePage() {
  const [selectedView, setSelectedView] = useState<'nativenode' | 'domain'>('nativenode')
  const usageType = selectedView === 'nativenode' ? 'nativenode' : 'domain'

  const { data, isLoading } = useOverviewUsage(usageType)

  return (
    <div className='grid gap-6'>
      <ServerUsageTable
        data={data}
        isLoading={isLoading}
        description={
          selectedView === 'nativenode'
            ? 'Detailed network traffic statistics for all your servers'
            : 'Legacy and testing environment data usage'
        }
        selectedView={selectedView}
        onChangeView={setSelectedView}
      />
    </div>
  )
}

export default NetworkUsagePage
