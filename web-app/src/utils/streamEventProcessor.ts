import { ChatMessage } from '@/hooks/useChatLogic'
import { StreamConnectionState } from '@/types/streaming'
import { JsonMessageHandlers, StreamingActivity } from './jsonMessageHandlers'
import { JsonBufferParser } from './jsonBufferParser'

export class StreamEventProcessor {
  private handlers: JsonMessageHandlers
  private bufferParser: JsonBufferParser

  constructor(
    updateAssistantMessage: (index: number, content: string) => void,
    replaceAssistantMessage: (index: number, message: ChatMessage) => void,
    setIsStreaming: (streaming: boolean) => void,
    setStreamingActivity?: (activity: StreamingActivity | null) => void,
    onProjectCreated?: () => void
  ) {
    this.handlers = new JsonMessageHandlers(
      updateAssistantMessage,
      replaceAssistantMessage,
      setIsStreaming,
      setStreamingActivity,
      onProjectCreated
    )
    this.bufferParser = new JsonBufferParser()
  }

  processMessage(
    event: MessageEvent,
    assistantMessageIndex: number,
    state: StreamConnectionState,
    eventSource: EventSource
  ): void {
    try {
      state.messageCount++
      state.hasReceivedData = true

      if (!event.data || event.data.trim() === '') {
        return
      }

      this.bufferParser.addToBuffer(event.data)

      this.bufferParser.parseJsonObjects((parsedData) => {
        this.handleJsonData(parsedData, assistantMessageIndex, state, eventSource)
      })
    } catch (error) {
      //
    }
  }

  private handleJsonData(
    parsedData: any,
    assistantMessageIndex: number,
    state: StreamConnectionState,
    eventSource: EventSource
  ): void {
    if (parsedData.type === 'system') {
      this.handlers.handleSystemMessage(parsedData)
    } else if (parsedData.type === 'user') {
      this.handlers.handleUserMessage(parsedData)
    } else if (parsedData.type === 'tool_use') {
      this.handlers.handleToolUse(parsedData)
    } else if (parsedData.type === 'tool_result') {
      this.handlers.handleToolResult(parsedData)
    } else if (parsedData.type === 'assistant' && parsedData.message) {
      this.handlers.handleAssistantMessage(parsedData, assistantMessageIndex, state)
    } else if (parsedData.type === 'result') {
      this.handlers.handleResultMessage(parsedData, assistantMessageIndex, state)
    } else if (parsedData.type === 'content_block_delta' && parsedData.delta?.text) {
      this.handlers.handleContentDelta(parsedData, assistantMessageIndex, state)
    } else if (parsedData.type === 'message_delta' && parsedData.delta?.stop_reason) {
      this.handlers.handleMessageCompletion(parsedData)
    } else if (parsedData.type === 'meta' && parsedData.event === 'eot') {
      this.handlers.handleEndOfTurn()
    } else if (parsedData.type === 'error') {
      this.handlers.handleErrorMessage(parsedData, assistantMessageIndex)
    } else {
      this.handlers.handleAgentTextResponse(parsedData, assistantMessageIndex)
    }
  }
}
