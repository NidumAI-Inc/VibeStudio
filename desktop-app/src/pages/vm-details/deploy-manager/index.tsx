import { useState } from 'react'

import type { deployT } from '@/types/vm'
import useVMStore from '@/store/vm'
import useUIStore from '@/store/ui'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import CreateForm from './create-form'
import LogsModal from '@/components/models/logs-modal'
import Details from './details'
import Empty from './list/empty'
import List from './list'

function DeployManager({ id, port, status }: deployT) {
  const [selectedDeployment, setSelectedDeployment] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('deployments')

  const open = useUIStore((store) => store.open)

  const deployments = useVMStore((s) => s.vms?.find((vm) => vm.id === id)?.deployManager)

  const handleSelectDeployment = (applicationId: string) => {
    setSelectedDeployment(applicationId)
    setActiveTab('detail')
  }

  const handleCreate = (applicationId: string) => {
    setActiveTab('deployments')
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='mx-auto max-w-7xl pt-4'>
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
              <div className='flex items-center justify-between mb-4'>
                <TabsList>
                  <TabsTrigger value='deployments'>Deployments</TabsTrigger>
                  <TabsTrigger value='create'>Create New</TabsTrigger>
                  {
                    status === 'running' && selectedDeployment &&
                    <TabsTrigger value='detail'>Deployment Details</TabsTrigger>
                  }
                </TabsList>
              </div>

              <TabsContent value='deployments' className='space-y-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>Node.js Deployments</CardTitle>
                    <CardDescription>Manage all your Node.js application deployments.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {deployments?.length === 0 && <Empty />}
                    {deployments?.length > 0 && (
                      <List
                        id={id}
                        port={port}
                        status={status}
                        deployments={deployments}
                        onSelectDeployment={handleSelectDeployment}
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='create' className='space-y-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Deployment</CardTitle>
                    <CardDescription>Deploy a new Node.js application from a Git repository.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CreateForm id={id} port={port} status={status} onCreate={handleCreate} />
                  </CardContent>
                </Card>
              </TabsContent>

              {status === 'running' && selectedDeployment && (
                <TabsContent value='detail' className='space-y-6'>
                  <Details
                    id={id}
                    port={port}
                    status={status}
                    applicationId={selectedDeployment}
                    onBack={() => setActiveTab('deployments')}
                  />
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>

      {open == 'log-modal' && <LogsModal />}
    </div>
  )
}

export default DeployManager
