
import { StreamingActivity } from "../jsonMessageHandlers";

export class ToolMessageHandler {
  constructor(
    private setStreamingActivity?: (activity: StreamingActivity | null) => void
  ) {}

  handleToolUse(parsedData: any): void {
    // console.log('🔨 Tool use:', parsedData);
    
    if (this.setStreamingActivity) {
      const toolName = parsedData.name || parsedData.tool_name || 'Unknown Tool';
      this.setStreamingActivity({
        type: 'tool_use',
        description: `Executing: ${toolName}`,
        details: parsedData.input || parsedData,
        timestamp: Date.now()
      });
    }
  }

  handleToolResult(parsedData: any): void {
    // console.log('✅ Tool result:', parsedData);
    
    if (this.setStreamingActivity) {
      const isError = parsedData.is_error || false;
      this.setStreamingActivity({
        type: 'tool_result',
        description: isError ? 'Tool execution failed' : 'Tool completed successfully',
        details: parsedData,
        timestamp: Date.now()
      });
    }
  }
}
