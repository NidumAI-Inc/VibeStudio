import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { useCodeDumpUIStore } from '@/store/codeDumpUIStore'
import { Code2 } from 'lucide-react'
import { WrittenAction } from '@/types/written-actions'
import { cn } from '@/lib/utils'

interface Props {
  actions: WrittenAction[]
  isStreaming: boolean
}

const CodeReadyCard = ({ actions = [], isStreaming }: Props) => {
  const [shouldShow, setShouldShow] = useState(false)
  const setShowCodeDump = useCodeDumpUIStore((state) => state.setShowCodeDump)
  const setSelectedActions = useCodeDumpUIStore((state) => state.setSelectedActions)
  // console.log(
  //   'action types:',
  //   actions.filter((a) => a.type).map((a) => a.type)
  // )

  useEffect(() => {
    const hasValid = actions.some((a) => ['write', 'edit', 'bash'].includes(a.type))
    setShouldShow(!isStreaming && hasValid)
  }, [isStreaming, actions])

  if (!shouldShow) return null

  return (
    <Card
      onClick={() => {
        setSelectedActions(actions)
        setShowCodeDump(true)
      }}
      className={cn(
        'cursor-pointer p-5 rounded-xl border border-green-200 bg-green-50 dark:bg-white/5',
        'hover:shadow-md transition-all duration-300 ease-in-out mb-4',
        'w-full max-w-full min-w-0 overflow-hidden break-words'
      )}>
      <div className='flex items-start gap-4 relative'>
        <div className='flex items-center absolute -top-1.5 justify-center w-9 h-9 rounded-lg text-green-700 dark:bg-white/10'>
          <Code2 className='w-5 h-5' />
        </div>

        <div className='flex flex-col ml-12'>
          <span className='text-sm font-semibold text-green-700 mb-1'>Stream ended</span>
          <div className='text-xs font-mono text-green-950'>Click to view generated code</div>
        </div>
      </div>
    </Card>
  )
}

export default CodeReadyCard
