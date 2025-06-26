
import { useEffect } from 'react';

interface UseBeforeUnloadWarningProps {
  isStreaming: boolean;
  warningMessage?: string;
}

export const useBeforeUnloadWarning = ({ 
  isStreaming, 
  warningMessage = "You have an active chat stream in progress. Are you sure you want to leave? This will stop the current response." 
}: UseBeforeUnloadWarningProps) => {
  
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isStreaming) {
        // Set the return value to show the browser's confirmation dialog
        event.preventDefault();
        event.returnValue = warningMessage;
        return warningMessage;
      }
    };

    // Add event listener when streaming starts
    if (isStreaming) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isStreaming, warningMessage]);
};
