import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { ChatMessage } from '@/types/chat'
import { StreamingActivity } from '@/utils/jsonMessageHandlers'
import { WrittenAction } from '@/types/written-actions'
import { Turn } from '@/types/chat'

interface ChatLayoutProps {
  currentStreamId: string | null
  projectName?: string
  messages: ChatMessage[]
  isStreaming: boolean
  streamingActivity: StreamingActivity | null
  input: string
  setInput: (value: string) => void
  onSendMessage: () => void
  onStopStreaming: () => void
  onToggleFileExplorer?: () => void
  showFileExplorer?: boolean
  soundEnabled: boolean
  onToggleSound: () => void
  writtenActions: WrittenAction[]
  isHistoryMode?: boolean
  turns?: Turn[]
}

const ChatLayout = ({
  currentStreamId,
  projectName,
  messages,
  isStreaming,
  streamingActivity,
  input,
  setInput,
  onSendMessage,
  onStopStreaming,
  onToggleFileExplorer,
  showFileExplorer,
  soundEnabled,
  onToggleSound,
  writtenActions,
  isHistoryMode,
  turns,
}: ChatLayoutProps) => {
  return (
    <div className='flex flex-col h-full bg-white'>
      <div className='flex-1 overflow-hidden'>
        <MessageList
          messages={messages}
          isStreaming={isStreaming}
          streamingActivity={streamingActivity}
          writtenActions={writtenActions}
          isHistoryMode={isHistoryMode}
          turns={turns}
        />
      </div>
      <div className='flex-shrink-0 p-4 border-t border-blue-200'>
        <MessageInput
          input={input}
          setInput={setInput}
          isStreaming={isStreaming}
          onSendMessage={onSendMessage}
          onStopStreaming={onStopStreaming}
        />
      </div>
    </div>
  )
}

export default ChatLayout
