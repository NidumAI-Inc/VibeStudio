import { ChatMessage } from '@/types/chat'
import { WrittenAction } from './written-actions'

export interface UseStreamingHandlerProps {
  updateAssistantMessage: (index: number, content: string) => void
  replaceAssistantMessage: (index: number, message: ChatMessage) => void
  setIsStreaming: (streaming: boolean) => void
  onProjectCreated?: () => void
  onWriteAction?: (action: WrittenAction) => void
}

export interface StreamEventData {
  type?: string
  delta?: {
    text?: string
    stop_reason?: string
  }
  event?: string
  message?: string
  content?: any
}

export interface StreamConnectionState {
  hasReceivedData: boolean
  accumulatedContent: string
  messageCount: number
  connectionTimeout: NodeJS.Timeout | null
}
