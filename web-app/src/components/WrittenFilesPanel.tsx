import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Code2, Loader2 } from 'lucide-react'
import { WrittenAction } from '@/types/written-actions'
import { useCodeDumpUIStore } from '@/store/codeDumpUIStore'

interface Props {
  actions: WrittenAction[]
  isStreaming: boolean
}

const WrittenFilesPanel = ({ actions = [], isStreaming }: Props) => {
  const [latestAction, setLatestAction] = useState<WrittenAction | null>(null)
  const setShowCodeDump = useCodeDumpUIStore((state) => state.setShowCodeDump)
  const setSelectedActions = useCodeDumpUIStore((state) => state.setSelectedActions)

  useEffect(() => {
    if (!actions.length) return
    const last = actions[actions.length - 1]
    setLatestAction(last)
  }, [actions])

  useEffect(() => {
    if (isStreaming && actions.length > 0) {
      setSelectedActions(actions)
    }
  }, [actions, isStreaming])

  if (!latestAction) return null

  const isWrite = latestAction.type === 'write'
  const label = isWrite ? 'Writing file' : 'Executing'
  const icon = isStreaming ? (
    <>
      <div className='relative'>
        <Loader2 className='w-5 h-5 animate-spin text-blue-600' />
        <div className='absolute inset-0 w-5 h-5 rounded-full border-2 border-blue-200 animate-ping' />
      </div>
    </>
  ) : (
    <Code2 className='w-4 h-4' />
  )

  let rawText = ''
  if (latestAction.type === 'write' || latestAction.type === 'edit') {
    rawText = latestAction.path.split('/').pop() || latestAction.path
  } else if (latestAction.type === 'bash') {
    rawText = latestAction.command
  }

  const displayText = rawText

  return (
    <Card
      key={JSON.stringify(latestAction)}
      onClick={() => {
        setSelectedActions(actions)
        setShowCodeDump(true)
      }}
      className={cn(
        'cursor-pointer p-5 rounded-xl border border-blue-200 bg-blue-50 dark:bg-white/5',
        'hover:shadow-md transition-all duration-300 ease-in-out mx-auto mt-4 max-w-xs '
      )}>
      <div className='flex items-start gap-4 relative'>
        <div className='flex items-center  absolute -top-1.5 justify-center w-9 h-9 rounded-lg  text-blue-600 dark:bg-white/10'>
          {icon}
        </div>

        <div className='flex flex-col ml-12'>
          <span className='relative text-sm font-semibold text-blue-600 mb-0.5 overflow-hidden'>
            <span className='relative flex flex-row gap-1 items-baseline text-sm font-semibold text-blue-600 mb-0.5 overflow-hidden  animate-pulse'>
              {label}
              <div className='flex space-x-1 mt-2'>
                {[0, 0.1, 0.2].map((delay) => (
                  <span
                    key={delay}
                    className='w-[3px] h-[3px] bg-blue-600 rounded-full animate-bounce'
                    style={{ animationDelay: `${delay}s` }}
                  />
                ))}
              </div>
            </span>
          </span>

          <div className='relative group mt-3'>
            <div
              title={rawText}
              className='max-w-[190px] w-full px-3 py-2 rounded-md bg-blue-100/80 text-xs font-mono text-blue-950 overflow-hidden text-ellipsis whitespace-nowrap'>
              {displayText}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default WrittenFilesPanel
