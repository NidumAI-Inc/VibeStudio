
import { Button } from "@/components/ui/button";
import { ExternalLink, AlertCircle, RefreshCw } from "lucide-react";

interface PreviewErrorStateProps {
  previewUrl: string;
  onRefresh: () => void;
}

const PreviewErrorState = ({ previewUrl, onRefresh }: PreviewErrorStateProps) => {
  return (
    <div className="flex items-center justify-center h-full text-gray-900">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center mb-4">
          <AlertCircle className="w-12 h-12 text-orange-500" />
        </div>
        <p className="text-lg mb-2 text-gray-900 font-semibold">Preview Blocked</p>
        <p className="text-sm mb-4 text-gray-700">
          Your browser is blocking the preview due to security restrictions. 
          Your app is running successfully at {previewUrl}.
        </p>
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            onClick={onRefresh}
            className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open(previewUrl, '_blank')}
            className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open in New Tab
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewErrorState;
