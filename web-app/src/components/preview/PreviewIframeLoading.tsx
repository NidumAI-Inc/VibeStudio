
import { Loader2 } from "lucide-react";

const PreviewIframeLoading = () => {
  return (
    <div className="flex items-center justify-center h-full text-gray-900">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
        <p className="text-sm text-gray-700">Loading preview...</p>
      </div>
    </div>
  );
};

export default PreviewIframeLoading;
