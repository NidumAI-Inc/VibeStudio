import type { deployManagerT, deployT } from '@/types/vm'

import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Row from './row'

type props = {
  deployments: deployManagerT[]
  onSelectDeployment: (applicationId: string) => void
} & deployT

function List({ deployments, onSelectDeployment, ...rest }: props) {
  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Port</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deployments.map((deployment) => (
            <Row
              key={deployment.application_id}
              {...rest}
              deployment={deployment}
              onSelectDeployment={onSelectDeployment}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default List
