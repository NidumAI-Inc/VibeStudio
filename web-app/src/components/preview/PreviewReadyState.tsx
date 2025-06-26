
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface PreviewReadyStateProps {
  onRunApp?: () => void;
}

const PreviewReadyState = ({ onRunApp }: PreviewReadyStateProps) => {
  return (
    <div className="flex items-center justify-center h-full text-gray-900">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Play className="w-12 h-12 text-blue-500" />
        </div>
        <p className="text-lg mb-2 text-gray-900 font-semibold">Ready to Preview</p>
        <p className="text-sm mb-4 text-gray-700">Start your app to see the live preview</p>
        {onRunApp && (
          <Button
            onClick={onRunApp}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            <Play className="w-4 h-4 mr-2" />
            Start App
          </Button>
        )}
      </div>
    </div>
  );
};

export default PreviewReadyState;
