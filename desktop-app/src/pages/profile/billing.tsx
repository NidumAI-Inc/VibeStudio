import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Rocket } from 'lucide-react'
import { DisabledTooltipButton } from '@/components/ui/tooltip'
import TooltipBtn from '@/components/common/tooltip-btn'

function Billing() {
  return (
    <Card className='shadow-sm border-border'>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <CreditCard className='h-5 w-5 text-muted-foreground' />
          <CardTitle>Billing Information</CardTitle>
        </div>
        <CardDescription>Your current subscription and payment details</CardDescription>
      </CardHeader>

      <CardContent className='space-y-6 pt-2'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div>
            <p className='text-sm text-muted-foreground mb-1'>Current Plan</p>
            <Badge className='bg-green-100 text-green-700 dark:bg-green-300/10 dark:text-green-400'>Free Tier</Badge>
            <p className='text-xs text-muted-foreground mt-1'>Access to basic features with limited resource usage.</p>
          </div>
          <DisabledTooltipButton tooltip='Coming soon'>
            <TooltipBtn size='sm' variant='default' disabled description=''>
              <Rocket className='w-4 h-4' /> Upgrade Plan
            </TooltipBtn>
          </DisabledTooltipButton>
        </div>
      </CardContent>
    </Card>
  )
}

export default Billing
