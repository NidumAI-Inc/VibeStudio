import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Button, type ButtonProps } from "@/components/ui/button"

type Props = {
  description: string
} & ButtonProps

function TooltipBtn({ description, ...props }: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size='icon'
            variant='ghost'
            {...props}
          />
        </TooltipTrigger>

        <TooltipContent className="bg-white text-black border">
          {description}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default TooltipBtn
