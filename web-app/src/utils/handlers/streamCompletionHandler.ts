
import { StreamingActivity } from "../jsonMessageHandlers";

export class StreamCompletionHandler {
  constructor(
    private setIsStreaming: (streaming: boolean) => void,
    private setStreamingActivity?: (activity: StreamingActivity | null) => void
  ) {}

  handleMessageCompletion(parsedData: any): void {
    // console.log('🏁 Message completed');
    
    // Clear streaming activity and end streaming
    this.endStream();
  }

  handleEndOfTurn(): void {
    // console.log('🔚 End of turn received');
    this.endStream();
  }

  private endStream(): void {
    // console.log('🔚 Ending stream');
    if (this.setStreamingActivity) {
      this.setStreamingActivity(null);
    }
    this.setIsStreaming(false);
  }
}
