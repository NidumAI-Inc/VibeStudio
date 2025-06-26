import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChatLogic } from './useChatLogic'
import { useStreamingHandler } from './useStreamingHandler'
import { useErrorDetection } from './useErrorDetection'
import { useBeforeUnloadWarning } from './useBeforeUnloadWarning'
import { useNavigationBlocking } from './useNavigationBlocking'
import { useSoundNotifications } from './useSoundNotifications'
import { WrittenAction } from '@/types/written-actions'
import { useCodeDumpUIStore } from '@/store/codeDumpUIStore'

interface UseChatInterfaceProps {
  streamId: string | null
  onProjectCreated?: () => void
  initialPrompt?: string
  skipHistory?: boolean
}

export const useChatInterface = ({ streamId, onProjectCreated, initialPrompt, skipHistory }: UseChatInterfaceProps) => {
  const [writtenActions, setWrittenActions] = useState<WrittenAction[]>([])
  const hasNavigated = useRef(false)
  const setShowCodeDump = useCodeDumpUIStore((s) => s.setShowCodeDump)

  useEffect(() => {
    setShowCodeDump(false)
  }, [streamId])

  const {
    messages,
    input,
    setInput,
    isStreaming,
    setIsStreaming,
    streamingActivity,
    setStreamingActivity,
    currentStreamId,
    addUserMessage,
    addAssistantMessage,
    updateAssistantMessage,
    replaceAssistantMessage,
    removeLastMessage,
    startChat,
    stopStreaming,
    turns,
  } = useChatLogic({ initialStreamId: streamId, onProjectCreated, skipHistory })

  const { hasError, errorDetails, dismissError } = useErrorDetection(streamId || currentStreamId)

  useBeforeUnloadWarning({
    isStreaming,
    warningMessage:
      'You have an active chat stream in progress. Leaving now will stop the current response. Are you sure you want to continue?',
  })

  const { safeNavigate } = useNavigationBlocking({
    isStreaming,
    warningMessage:
      'You have an active chat stream in progress. Navigating away will stop the current response. Are you sure you want to continue?',
  })

  const { soundEnabled, toggleSound } = useSoundNotifications({
    isStreaming,
    messages,
  })

  const { handleStreamResponse } = useStreamingHandler({
    updateAssistantMessage,
    replaceAssistantMessage,
    setIsStreaming,
    setStreamingActivity,
    onProjectCreated: () => {
      if (onProjectCreated) onProjectCreated()
      if (!streamId && currentStreamId && !hasNavigated.current) {
        hasNavigated.current = true
        safeNavigate(`/project/${currentStreamId}/chat`, { replace: true })
      }
    },
    onWriteAction: (action: WrittenAction) => {
      setWrittenActions((prev) => [...prev, action])
    },
  })

  const handleSendMessage = async (messageContent?: string) => {
    const userInput = messageContent || input.trim()
    if (!userInput || isStreaming) return
    setInput('')
    setIsStreaming(true)
    addUserMessage(userInput)
    const currentIndex = messages.length + 1
    addAssistantMessage()
    try {
      const newStreamId = await startChat(userInput)
      handleStreamResponse(newStreamId, currentIndex)
    } catch {
      setIsStreaming(false)
      removeLastMessage()
    }
  }

  return {
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
  }
}
