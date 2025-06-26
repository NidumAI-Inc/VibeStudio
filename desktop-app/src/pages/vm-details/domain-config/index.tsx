import { useState } from 'react'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import DomainForm from './domain-form'
import DomainList from './domain-list'

function DomainConfig({ id }: { id: string }) {
  const [isAddingDomain, setIsAddingDomain] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg flex items-center gap-2'>Domain Configuration</CardTitle>
      </CardHeader>

      <CardContent>
        {isAddingDomain ? (
          <DomainForm
            id={id}
            onCancel={() => setIsAddingDomain(false)}
          />
        ) : (
          <>
            <DomainList id={id} />

            <button
              className='text-sm text-primary cursor-pointer'
              onClick={() => setIsAddingDomain(true)}
            >
              + Add Another Domain
            </button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default DomainConfig
