import { Badge } from '@/components/ui/badge'

type props = {
  status: string
}
function GetStatus({ status }: props) {
  switch (status) {
    case 'running':
      return <Badge className='bg-green-500'>Running</Badge>
    case 'stopped':
      return <Badge variant='outline'>Stopped</Badge>
    case 'building':
      return <Badge className='bg-primary'>Building</Badge>
    case 'deploying':
      return <Badge className='bg-purple-500'>Deploying</Badge>
    case 'error':
      return <Badge className='bg-red-500'>Error</Badge>
    default:
      return (
        <Badge variant='outline' className='capitalize'>
          {status}
        </Badge>
      )
  }
}

export default GetStatus
