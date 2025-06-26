
import { generateErrorFixPrompt } from "@/utils/errorFixPrompt";
import ErrorDetectionPopup from "@/components/ErrorDetectionPopup";

interface ChatErrorHandlerProps {
  hasError: boolean;
  errorDetails: any;
  streamId: string | null;
  currentStreamId: string | null;
  dismissError: () => void;
  handleSendMessage: (message: string) => void;
}

const ChatErrorHandler = ({
  hasError,
  errorDetails,
  streamId,
  currentStreamId,
  dismissError,
  handleSendMessage
}: ChatErrorHandlerProps) => {
  
  const handleTryFix = () => {
    if (errorDetails && (streamId || currentStreamId)) {
      const fixPrompt = generateErrorFixPrompt({
        install: errorDetails.install,
        runtime: errorDetails.runtime,
        streamId: streamId || currentStreamId || ''
      });
      
      dismissError();
      handleSendMessage(fixPrompt);
    }
  };

  return (
    <ErrorDetectionPopup
      isOpen={hasError}
      onClose={dismissError}
      onTryFix={handleTryFix}
      errorDetails={errorDetails}
    />
  );
};

export default ChatErrorHandler;
