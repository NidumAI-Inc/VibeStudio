import { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react'
import { useChatInterface } from '@/hooks/useChatInterface'
import ChatLayout from './ChatLayout'
import ChatEffects from './chat/ChatEffects'
import ChatErrorHandler from './chat/ChatErrorHandler'
import ChatNavigationEffects from './chat/ChatNavigationEffects'
import AccessControlWrapper from './AccessControlWrapper'
import { useAuthStore } from '@/store/authStore'
import { Turn } from '@/types/chat'

interface ChatInterfaceProps {
  streamId: string | null
  projectName?: string
  onProjectCreated?: () => void
  initialPrompt?: string
  autoStart?: boolean
  onToggleFileExplorer?: () => void
  showFileExplorer?: boolean
  turns?: Turn[]
  skipHistory?: boolean
}

export interface ChatInterfaceRef {
  sendMessage: (message: string) => void
  writtenActions: any[]
  isStreaming: boolean
  turns?: Turn[]
}

const ChatInterface = forwardRef<ChatInterfaceRef, ChatInterfaceProps>(
  (
    {
      streamId,
      projectName,
      onProjectCreated,
      initialPrompt,
      autoStart,
      onToggleFileExplorer,
      showFileExplorer,
      skipHistory,
    },
    ref
  ) => {
    const {
      messages,
      input,
      setInput,
      isStreaming,
      streamingActivity,
      currentStreamId,
      hasError,
      errorDetails,
      soundEnabled,
      handleSendMessage,
      stopStreaming,
      dismissError,
      toggleSound,
      hasNavigated,
      safeNavigate,
      writtenActions,
      turns,
    } = useChatInterface({ streamId, onProjectCreated, initialPrompt, skipHistory })

    useImperativeHandle(
      ref,
      () => ({
        sendMessage: (message: string) => {
          handleSendMessage(message)
        },
        writtenActions,
        isStreaming,
        turns,
      }),
      [handleSendMessage, writtenActions, isStreaming, turns]
    )

    const { userId } = useAuthStore()
    const isHistoryMode = useMemo(() => {
      return Boolean(streamId && !isStreaming)
    }, [streamId, isStreaming])

    return (
      <AccessControlWrapper userId={userId} requireChat={true}>
        <ChatLayout
          currentStreamId={currentStreamId}
          projectName={projectName}
          messages={messages}
          isStreaming={isStreaming}
          streamingActivity={streamingActivity}
          input={input}
          setInput={setInput}
          onSendMessage={() => handleSendMessage()}
          onStopStreaming={stopStreaming}
          onToggleFileExplorer={onToggleFileExplorer}
          showFileExplorer={showFileExplorer}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          writtenActions={writtenActions}
          isHistoryMode={isHistoryMode}
          turns={turns}
        />

        <ChatEffects
          initialPrompt={initialPrompt}
          currentStreamId={currentStreamId}
          messages={messages}
          isStreaming={isStreaming}
          streamId={streamId}
          handleSendMessage={handleSendMessage}
          setInput={setInput}
        />

        <ChatNavigationEffects
          isStreaming={isStreaming}
          currentStreamId={currentStreamId}
          streamId={streamId}
          hasNavigated={hasNavigated}
          messages={messages}
          safeNavigate={safeNavigate}
        />

        <ChatErrorHandler
          hasError={hasError}
          errorDetails={errorDetails}
          streamId={streamId}
          currentStreamId={currentStreamId}
          dismissError={dismissError}
          handleSendMessage={handleSendMessage}
        />
      </AccessControlWrapper>
    )
  }
)

ChatInterface.displayName = 'ChatInterface'

export default ChatInterface
