
import { StreamingActivity } from "../jsonMessageHandlers";

export class SystemMessageHandler {
  constructor(
    private setStreamingActivity?: (activity: StreamingActivity | null) => void
  ) {}

  handle(parsedData: any): void {
    // console.log('🔧 System message:', parsedData);
    
    if (this.setStreamingActivity) {
      if (parsedData.subtype === 'init') {
        this.setStreamingActivity({
          type: 'system',
          description: 'Initializing development environment',
          details: {
            tools: parsedData.tools || [],
            model: parsedData.model,
            session: parsedData.session_id
          },
          timestamp: Date.now()
        });
      } else {
        this.setStreamingActivity({
          type: 'system',
          description: `System: ${parsedData.subtype || 'processing'}`,
          details: parsedData,
          timestamp: Date.now()
        });
      }
    }
  }
}
