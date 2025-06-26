import { useEffect, useRef, useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

const FilenameWithTooltip: React.FC<{ name: string }> = ({ name }) => {
  const nameRef = useRef<HTMLSpanElement | null>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)

  useEffect(() => {
    const el = nameRef.current
    if (el) {
      setIsOverflowing(el.scrollWidth > el.clientWidth)
    }
  }, [name])

  const nameSpan = (
    <span ref={nameRef} className='block truncate text-sm cursor-default' title={isOverflowing ? '' : undefined}>
      {name}
    </span>
  )

  return isOverflowing ? (
    <Tooltip>
      <TooltipTrigger asChild>{nameSpan}</TooltipTrigger>
      <TooltipContent className='bg-white text-black border border-gray-200 shadow-sm rounded px-2 py-1'>
        {name}
      </TooltipContent>
    </Tooltip>
  ) : (
    nameSpan
  )
}

export default FilenameWithTooltip
