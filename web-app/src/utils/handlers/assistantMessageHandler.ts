
import { ChatMessage } from "@/hooks/useChatLogic";
import { StreamConnectionState } from "@/types/streaming";
import { StreamingActivity } from "../jsonMessageHandlers";

export class AssistantMessageHandler {
  constructor(
    private updateAssistantMessage: (index: number, content: string) => void,
    private replaceAssistantMessage: (index: number, message: ChatMessage) => void,
    private setIsStreaming: (streaming: boolean) => void,
    private setStreamingActivity?: (activity: StreamingActivity | null) => void,
    private onProjectCreated?: () => void
  ) {}

  handleUserMessage(parsedData: any): void {
    // console.log('👤 ASSISTANT HANDLER - Processing user message:', parsedData);
    // User messages are handled elsewhere, just log for debugging
  }

  handleAssistantMessage(parsedData: any, assistantMessageIndex: number, state: StreamConnectionState): void {
    // console.log('🤖 ASSISTANT HANDLER - Processing assistant message:', parsedData);
    
    if (parsedData.message && typeof parsedData.message === 'object') {
      // console.log('📝 ASSISTANT HANDLER - Message object found:', parsedData.message);
      
      // Handle message with content property
      if (parsedData.message.content) {
        let content = parsedData.message.content;
        
        // Ensure content is a string, not an object
        if (typeof content === 'object') {
          // console.log('⚠️ ASSISTANT HANDLER - Content is object, converting:', content);
          // If it's an array, join the text parts
          if (Array.isArray(content)) {
            content = content
              .filter(item => item && typeof item === 'object' && item.text)
              .map(item => item.text)
              .join('');
          } else if (content.text) {
            content = content.text;
          } else {
            // console.log('❌ ASSISTANT HANDLER - Unknown content object structure, skipping');
            return;
          }
        }
        
        // Only update if content is a valid string
        if (typeof content === 'string' && content.trim()) {
          // console.log('✅ ASSISTANT HANDLER - Updating message with clean content:', content);
          this.replaceAssistantMessage(assistantMessageIndex, {
            role: 'assistant',
            content: content,
            timestamp: Date.now()
          });
        }
      }
    }
  }

  handleContentDelta(parsedData: any, assistantMessageIndex: number, state: StreamConnectionState): void {
    // console.log('📝 ASSISTANT HANDLER - Processing content delta:', parsedData);
    
    if (parsedData.delta && parsedData.delta.text) {
      const deltaText = parsedData.delta.text;
      
      // Ensure delta text is a string
      if (typeof deltaText === 'string') {
        // console.log('✅ ASSISTANT HANDLER - Adding delta text:', deltaText);
        this.updateAssistantMessage(assistantMessageIndex, deltaText);
      } else {
        // console.log('⚠️ ASSISTANT HANDLER - Delta text is not a string:', typeof deltaText, deltaText);
      }
    }
  }
}
