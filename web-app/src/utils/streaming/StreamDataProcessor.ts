import { StreamEventProcessor } from '../streamEventProcessor'
import { StreamConnectionState } from '@/types/streaming'

export class StreamDataProcessor {
  constructor(private processor: StreamEventProcessor, private assistantMessageIndex: number) {}

  processJsonContent(content: string, state: StreamConnectionState): void {
    const timestamp = new Date().toISOString()

    const mockEvent = {
      data: content,
      type: 'message',
    } as MessageEvent

    // Use existing processor to handle the content
    this.processor.processMessage(
      mockEvent,
      this.assistantMessageIndex,
      state,
      {} as EventSource // Mock EventSource since we're not using it
    )
  }

  shouldContinueStreaming(fullResponse: string, noDataCount: number, maxNoDataAttempts: number): boolean {
    if (noDataCount >= maxNoDataAttempts) {
      const timeWaitedMinutes = Math.floor(noDataCount / 60)
      return false
    }

    // Check for completion indicators in the response
    const hasStopReason = fullResponse.includes('"stop_reason"')
    const hasEndOfTurn = fullResponse.includes('"event":"eot"')
    const hasMessageDelta = fullResponse.includes('"type":"message_delta"')
    const hasResultSuccess = fullResponse.includes('"subtype":"success"')

    const timeWaitedMinutes = Math.floor(noDataCount / 60)

    const shouldContinue = !hasStopReason && !hasEndOfTurn && !hasMessageDelta && !hasResultSuccess

    return shouldContinue
  }
}
