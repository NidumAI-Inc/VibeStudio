import { Loader } from 'lucide-react'

import { useTunnelSetup } from '@/hooks/use-tunnel'

import { Card, CardContent } from '@/components/ui/card'
import TryAgain from './try-again'
import List from './list'

interface Props {
  vmId: string
}

function TunnelConfig({ vmId: id }: Props) {
  const { isLoading, data } = useTunnelSetup()
  const isSetupedProperly = data?.["url-config"] && data?.["enable"]

  return (
    <Card>
      <CardContent className='space-y-6 relative'>
        <div className='df pt-2'>
          <h3 className='text-lg font-semibold'>Native Node Public URL</h3>
        </div>

        {isLoading && (
          <div className="dc h-60">
            <Loader className="size-5 animate-spin" />
          </div>
        )}

        {!isLoading && !isSetupedProperly && <TryAgain />}

        {!isLoading && isSetupedProperly && <List id={id} />}
      </CardContent>
    </Card>
  )
}

export default TunnelConfig
