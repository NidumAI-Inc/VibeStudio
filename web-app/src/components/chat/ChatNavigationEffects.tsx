
import { useEffect, MutableRefObject } from 'react';

interface ChatNavigationEffectsProps {
  isStreaming: boolean;
  currentStreamId: string | null;
  streamId: string | null;
  hasNavigated: MutableRefObject<boolean>;
  messages: any[];
  safeNavigate: (to: string, options?: any) => void;
}

const ChatNavigationEffects = ({
  isStreaming,
  currentStreamId,
  streamId,
  hasNavigated,
  messages,
  safeNavigate
}: ChatNavigationEffectsProps) => {
  
  // Monitor streaming completion for navigation
  useEffect(() => {
    // console.log('🔍 Streaming state changed:', { 
    //   isStreaming, 
    //   currentStreamId, 
    //   streamId, 
    //   hasNavigated: hasNavigated.current,
    //   messagesLength: messages.length 
    // });
    
    // Navigate when streaming stops and we have a stream ID for a new project using safe navigation
    if (!isStreaming && !streamId && currentStreamId && !hasNavigated.current && messages.length > 0) {
      // console.log('🚀 Streaming completed, navigating to project:', currentStreamId);
      hasNavigated.current = true;
      safeNavigate(`/project/${currentStreamId}/chat`, { replace: true });
    }
  }, [isStreaming, currentStreamId, streamId, messages.length, safeNavigate, hasNavigated]);

  return null; // This component only handles effects
};

export default ChatNavigationEffects;
