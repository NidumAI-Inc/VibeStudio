import { apiService } from '@/services/api'
import { UseStreamingHandlerProps } from '@/types/streaming'
import { StreamEventProcessor } from '@/utils/streamEventProcessor'
import { StreamConnection } from '@/utils/streaming/StreamConnection'
import { StreamingActivity } from '@/utils/jsonMessageHandlers'
import { WrittenAction } from '@/types/written-actions'

interface UseStreamingHandlerPropsExtended extends UseStreamingHandlerProps {
  setStreamingActivity?: (activity: StreamingActivity | null) => void
  onWriteAction?: (action: WrittenAction) => void
}

export const useStreamingHandler = ({
  updateAssistantMessage,
  replaceAssistantMessage,
  setIsStreaming,
  setStreamingActivity,
  onProjectCreated,
  onWriteAction,
}: UseStreamingHandlerPropsExtended) => {
  const handleStreamResponse = (streamId: string, assistantMessageIndex: number) => {
    // console.log('🚀 STREAMING HANDLER - Starting stream response handling');
    // console.log('📊 STREAMING HANDLER - Stream ID:', streamId);
    // console.log('📊 STREAMING HANDLER - Assistant message index:', assistantMessageIndex);

    const streamUrl = apiService.getStreamUrl(streamId)
    // console.log('🔗 STREAMING HANDLER - Stream URL:', streamUrl);

    const processor = new StreamEventProcessor(
      updateAssistantMessage,
      replaceAssistantMessage,
      setIsStreaming,
      setStreamingActivity,
      onProjectCreated
    )

    // console.log('🔧 STREAMING HANDLER - Created processor and connection');

    const connection = new StreamConnection(
      streamUrl,
      assistantMessageIndex,
      processor,
      replaceAssistantMessage,
      setIsStreaming,
      onWriteAction
    )

    // console.log('🚀 STREAMING HANDLER - Starting connection');
    connection.connect()

    // Return cleanup function
    return () => {
      // // console.log('🧹 STREAMING HANDLER - Cleaning up connection');
      connection.close()
    }
  }

  return { handleStreamResponse }
}
