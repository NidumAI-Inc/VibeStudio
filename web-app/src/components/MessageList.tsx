import React, { useRef, useEffect, useState } from 'react'
import { User, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import MessageContent from './MessageContent'
import WrittenFilesPanel from './WrittenFilesPanel'
import { ChatMessage } from '@/types/chat'
import { StreamingActivity } from '@/utils/jsonMessageHandlers'
import { WrittenAction } from '@/types/written-actions'
import CodeReadyCard from './StreamEndCard'
import { Brain, Flame, Lightbulb, Terminal } from 'lucide-react'
interface MessageListProps {
  messages: ChatMessage[]
  isStreaming: boolean
  streamingActivity?: StreamingActivity | null
  writtenActions: WrittenAction[]
  isHistoryMode
  turns
}

const ASSISTANT_THOUGHTS = [
  { label: 'Thinking...', Icon: Brain },
  { label: 'Warming up...', Icon: Flame },
  { label: 'Planning...', Icon: Lightbulb },
  { label: 'Starting terminal...', Icon: Terminal },
] as const

const MessageList: React.FC<MessageListProps> = ({
  messages,
  isStreaming,
  streamingActivity,
  writtenActions,
  isHistoryMode,
  turns,
}) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null)
  const [currentThought, setCurrentThought] = useState<(typeof ASSISTANT_THOUGHTS)[number]>(ASSISTANT_THOUGHTS[0])
  const [lastShownAction, setLastShownAction] = useState<WrittenAction | null>(null)
  const [streamedActions, setStreamedActions] = useState<WrittenAction[]>([])

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingActivity])

  useEffect(() => {
    if (!isStreaming) return

    const switchInterval = setTimeout(() => {
      const intervalId = setInterval(() => {
        const random = ASSISTANT_THOUGHTS[Math.floor(Math.random() * ASSISTANT_THOUGHTS.length)]
        setCurrentThought(random)
      }, 2000)

      return () => clearInterval(intervalId)
    }, 5000)

    return () => clearTimeout(switchInterval)
  }, [isStreaming])

  useEffect(() => {
    if (!isStreaming && writtenActions.length > 0) {
      const latest = writtenActions[writtenActions.length - 1]
      if (JSON.stringify(latest) !== JSON.stringify(lastShownAction)) {
        setLastShownAction(latest)
      }
    }
  }, [isStreaming, writtenActions, lastShownAction])

  useEffect(() => {
    if (isStreaming && writtenActions.length > 0) {
      setStreamedActions([...writtenActions])
    }
  }, [writtenActions, isStreaming])

  const visibleMessages = messages.filter((msg) => msg.role !== 'assistant' || (msg.content?.trim().length ?? 0) > 0)
  // console.log('isHistoryMode  ', isHistoryMode)
  return (
    <ScrollArea className='h-full'>
      <div className='p-6 space-y-6'>
        {visibleMessages.map((message, idx) => {
          const isAssistant = message.role === 'assistant'

          const matchingTurn = isHistoryMode && isAssistant ? turns.find((turn) => turn.chat_id === message.id) : null

          // if (isHistoryMode && isAssistant) {
          //   console.log('💬 message.id:', message.id)
          //   console.log('🔎 matchingTurn.chat_id:', matchingTurn?.chat_id)
          //   console.log('🧱 writtenActions:', matchingTurn?.writtenActions)
          // }

          return (
            <div key={`${message.role}-${message.timestamp}-${idx}`} className='flex items-start space-x-4 w-full'>
              <Avatar className='w-8 h-8 flex-shrink-0'>
                {message.role === 'user' ? (
                  <AvatarFallback className='bg-gray-100 text-gray-900'>
                    <User className='w-4 h-4' />
                  </AvatarFallback>
                ) : (
                  <AvatarImage src='/lovable-uploads/3e8e3e70-c61d-4649-b12d-ba1c2fbd0440.png' alt='VibeStudio Logo' />
                )}
              </Avatar>

              <div className='flex-1 min-w-0'>
                <div className='flex items-baseline space-x-2 mb-1'>
                  <span className='text-sm font-medium text-blue-600'>
                    {message.role === 'user' ? 'You' : 'VibeStudio'}
                  </span>
                  <span className='text-xs text-gray-500'>Now</span>
                </div>

                <div className='card_plus_content_div bg-white p-3 text-gray-900 rounded w-full max-w-[18rem] min-w-0 break-words overflow-hidden'>
                  {isHistoryMode &&
                    isAssistant &&
                    (() => {
                      const matchingTurn = turns.find((turn) => turn.chat_id === message.id)
                      // console.log('📦 msg.id', message.id)
                      // console.log('🔍 matchingTurn', matchingTurn)
                      // console.log('🧾 actions?', matchingTurn?.writtenActions)

                      if (!matchingTurn || !matchingTurn.writtenActions?.length) return null

                      return (
                        <CodeReadyCard key={message.id} actions={matchingTurn.writtenActions} isStreaming={false} />
                      )
                    })()}

                  {!isHistoryMode &&
                    isAssistant &&
                    writtenActions.some((a) => a.type === 'write' || a.type === 'edit' || a.type === 'bash') && (
                      <CodeReadyCard actions={writtenActions} isStreaming={isStreaming} />
                    )}
                  <MessageContent content={message.content} role={message.role} />
                </div>
              </div>
            </div>
          )
        })}

        {isStreaming && (
          <div className='flex items-start space-x-4 animate-fade-in'>
            <Avatar className='w-8 h-8 flex-shrink-0'>
              <AvatarImage
                src='/lovable-uploads/3e8e3e70-c61d-4649-b12d-ba1c2fbd0440.png'
                alt='VibeStudio Logo'
                className='animate-pulse'
              />
            </Avatar>

            <div className='flex-1 min-w-0'>
              <div className='flex items-baseline space-x-2 mb-1'>
                <span className='text-sm font-medium text-blue-600 animate-pulse'>VibeStudio</span>
                <span className='text-xs text-gray-500'>Now</span>
              </div>

              {streamedActions.length === 0 ? (
                <div className='bg-gradient-to-r h-[5rem] mt-2 from-blue-50 to-blue-100/50 p-4 pl-5 pt-4 rounded-lg border border-blue-200 backdrop-blur-sm'>
                  <div className='flex flex-col justify-between h-full'>
                    <div className='flex flex-col'>
                      <div className='flex items-center gap-2 text-sm font-medium text-blue-600 animate-pulse'>
                        <currentThought.Icon className='w-4 h-4 text-blue-600' />
                        <span>{currentThought.label}</span>
                      </div>
                      <div className='flex space-x-1 ml-7 mt-[1rem]'>
                        {[0, 0.1, 0.2].map((delay) => (
                          <span
                            key={delay}
                            className='w-2 h-2 bg-blue-600 rounded-full animate-bounce'
                            style={{ animationDelay: `${delay}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <WrittenFilesPanel actions={writtenActions} isStreaming={isStreaming} />
              )}
            </div>
          </div>
        )}

        <div ref={endOfMessagesRef} />
      </div>
    </ScrollArea>
  )
}

export default MessageList
