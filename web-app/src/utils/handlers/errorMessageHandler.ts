
import { ChatMessage } from "@/types/chat";
import { StreamingActivity } from "../jsonMessageHandlers";
import { toast } from "sonner";

export class ErrorMessageHandler {
  constructor(
    private replaceAssistantMessage: (index: number, message: ChatMessage) => void,
    private setIsStreaming: (streaming: boolean) => void,
    private setStreamingActivity?: (activity: StreamingActivity | null) => void
  ) {}

  handle(parsedData: any, assistantMessageIndex: number): void {
    // console.error('❌ Stream error received:', parsedData);
    
    if (this.setStreamingActivity) {
      this.setStreamingActivity({
        type: 'error',
        description: 'Error occurred',
        details: parsedData,
        timestamp: Date.now()
      });
    }

    const errorMessage: ChatMessage = {
      role: 'assistant',
      content: parsedData.message || 'An error occurred while processing your request.',
      timestamp: Date.now(),
    };
    this.replaceAssistantMessage(assistantMessageIndex, errorMessage);
    toast.error(parsedData.message || 'Stream error occurred');
    this.endStream();
  }

  private endStream(): void {
    // console.log('🔚 Ending stream');
    this.setIsStreaming(false);
    if (this.setStreamingActivity) {
      this.setStreamingActivity(null);
    }
  }
}
