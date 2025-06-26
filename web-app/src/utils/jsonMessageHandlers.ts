import { ChatMessage } from '@/hooks/useChatLogic'
import { StreamConnectionState } from '@/types/streaming'
import { SystemMessageHandler } from './handlers/systemMessageHandler'
import { ToolMessageHandler } from './handlers/toolMessageHandler'
import { AssistantMessageHandler } from './handlers/assistantMessageHandler'
import { StreamCompletionHandler } from './handlers/streamCompletionHandler'
import { ErrorMessageHandler } from './handlers/errorMessageHandler'

export interface StreamingActivity {
  type: string
  description: string
  details?: any
  timestamp: number
}

export class JsonMessageHandlers {
  private systemHandler: SystemMessageHandler
  private toolHandler: ToolMessageHandler
  private assistantHandler: AssistantMessageHandler
  private completionHandler: StreamCompletionHandler
  private errorHandler: ErrorMessageHandler

  constructor(
    private updateAssistantMessage: (index: number, content: string) => void,
    private replaceAssistantMessage: (index: number, message: ChatMessage) => void,
    private setIsStreaming: (streaming: boolean) => void,
    private setStreamingActivity?: (activity: StreamingActivity | null) => void,
    private onProjectCreated?: () => void
  ) {
    this.systemHandler = new SystemMessageHandler(setStreamingActivity)
    this.toolHandler = new ToolMessageHandler(setStreamingActivity)
    this.assistantHandler = new AssistantMessageHandler(
      updateAssistantMessage,
      replaceAssistantMessage,
      setIsStreaming,
      setStreamingActivity,
      onProjectCreated
    )
    this.completionHandler = new StreamCompletionHandler(setIsStreaming, setStreamingActivity)
    this.errorHandler = new ErrorMessageHandler(replaceAssistantMessage, setIsStreaming, setStreamingActivity)
  }

  handleSystemMessage(parsedData: any): void {
    this.systemHandler.handle(parsedData)
  }

  handleUserMessage(parsedData: any): void {
    this.assistantHandler.handleUserMessage(parsedData)
  }

  handleToolUse(parsedData: any): void {
    this.toolHandler.handleToolUse(parsedData)
  }

  handleToolResult(parsedData: any): void {
    this.toolHandler.handleToolResult(parsedData)
  }

  handleAssistantMessage(parsedData: any, assistantMessageIndex: number, state: StreamConnectionState): void {
    this.assistantHandler.handleAssistantMessage(parsedData, assistantMessageIndex, state)
  }

  handleResultMessage(parsedData: any, assistantMessageIndex: number, state: StreamConnectionState): void {
    if (parsedData.subtype === 'success' && parsedData.result) {
      this.updateAssistantMessage(assistantMessageIndex, parsedData.result)

      // Save cost if available
      if (parsedData.cost_usd) {
        import('./costTracker').then(({ saveCostToAPI }) => {
          saveCostToAPI(parsedData.cost_usd, parsedData.session_id)
        })
      }

      this.setIsStreaming(false)
      this.setStreamingActivity?.(null)
    } else if (parsedData.is_error) {
      this.handleErrorMessage(parsedData, assistantMessageIndex)
    }
  }

  handleContentDelta(parsedData: any, assistantMessageIndex: number, state: StreamConnectionState): void {
    this.assistantHandler.handleContentDelta(parsedData, assistantMessageIndex, state)
  }

  handleMessageCompletion(parsedData: any): void {
    this.completionHandler.handleMessageCompletion(parsedData)
  }

  handleEndOfTurn(): void {
    this.completionHandler.handleEndOfTurn()
  }

  handleErrorMessage(parsedData: any, assistantMessageIndex: number): void {
    this.errorHandler.handle(parsedData, assistantMessageIndex)
  }

  handleAgentTextResponse(parsedData: any, assistantMessageIndex: number): void {
    let textContent = ''

    if (typeof parsedData === 'string') {
      textContent = parsedData
    } else if (parsedData.text) {
      textContent = parsedData.text
    } else if (parsedData.content) {
      if (typeof parsedData.content === 'string') {
        textContent = parsedData.content
      } else if (parsedData.content.text) {
        textContent = parsedData.content.text
      }
    } else if (parsedData.message) {
      if (typeof parsedData.message === 'string') {
        textContent = parsedData.message
      } else if (parsedData.message.content) {
        textContent = parsedData.message.content
      }
    } else if (parsedData.response) {
      textContent = parsedData.response
    }

    if (textContent && textContent.trim()) {
      this.updateAssistantMessage(assistantMessageIndex, textContent)
    } else {
      //
    }
  }
}
