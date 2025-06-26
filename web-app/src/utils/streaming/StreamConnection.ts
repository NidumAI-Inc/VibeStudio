import { ChatMessage } from '@/hooks/useChatLogic'
import { StreamConnectionState } from '@/types/streaming'
import { StreamEventProcessor } from '../streamEventProcessor'
import { StreamDataProcessor } from './StreamDataProcessor'
import { StreamPoller } from './StreamPoller'
import { toast } from 'sonner'
import { WrittenAction } from '@/types/written-actions'

export class StreamConnection {
  private abortController: AbortController | null = null
  private poller: StreamPoller | null = null
  private state: StreamConnectionState = {
    hasReceivedData: false,
    accumulatedContent: '',
    messageCount: 0,
    connectionTimeout: null,
  }

  constructor(
    private streamUrl: string,
    private assistantMessageIndex: number,
    private processor: StreamEventProcessor,
    private replaceAssistantMessage: (index: number, message: ChatMessage) => void,
    private setIsStreaming: (streaming: boolean) => void,
    private onWriteAction?: (action: WrittenAction) => void
  ) {}

  connect(): void {
    this.startJsonStreaming()
  }

  private startJsonStreaming(): void {
    this.abortController = new AbortController()

    const dataProcessor = new StreamDataProcessor(this.processor, this.assistantMessageIndex)

    this.poller = new StreamPoller(
      this.streamUrl,
      this.abortController,
      dataProcessor,
      () => this.handleStreamComplete(),
      (error) => this.handleStreamError(error),
      (action: WrittenAction) => {
        if (this.onWriteAction) {
          this.onWriteAction(action)
        }
      }
    )

    this.poller.startPolling(this.state)
  }

  private handleStreamComplete(): void {
    this.cleanup()
    this.setIsStreaming(false)
  }

  private handleStreamError(error: any): void {
    const errorMessage: ChatMessage = {
      role: 'assistant',
      content:
        'Sorry, there was a connection issue with the stream. Your backend might still be processing the request. The system will wait up to 30+ minutes for responses.',
      timestamp: Date.now(),
    }

    this.replaceAssistantMessage(this.assistantMessageIndex, errorMessage)
    toast.error('Stream connection error. The system will keep trying for 30+ minutes.')

    this.cleanup()
    this.setIsStreaming(false)
  }

  private cleanup(): void {
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }

    if (this.poller) {
      this.poller.stop()
      this.poller = null
    }

    if (this.state.connectionTimeout) {
      clearTimeout(this.state.connectionTimeout)
      this.state.connectionTimeout = null
    }
  }

  close(): void {
    this.cleanup()
  }
}
