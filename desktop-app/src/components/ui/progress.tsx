import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'

import { cn } from '@/lib/utils'

function Progress({
  className,
  barClassName,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & { barClassName?: string }) {
  return (
    <ProgressPrimitive.Root
      data-slot='progress'
      className={cn('bg-primary/10 relative h-2 w-full overflow-hidden rounded-full', className)}
      style={{ backgroundColor: 'var(--progress-track)' }}
      {...props}>
      <ProgressPrimitive.Indicator
        data-slot='progress-indicator'
        className={cn('h-full w-full flex-1 transition-all bg-primary', barClassName)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
