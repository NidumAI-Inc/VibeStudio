
import { Button } from "@/components/ui/button";
import { FileX, Sparkles } from "lucide-react";

interface PreviewNoFilesStateProps {
  onDescribeApp?: () => void;
}

const PreviewNoFilesState = ({ onDescribeApp }: PreviewNoFilesStateProps) => {
  return (
    <div className="flex items-center justify-center h-full text-gray-900">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center mb-6">
          <FileX className="w-16 h-16 text-orange-500" />
        </div>
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Code Files Not Available</h3>
        <p className="text-sm mb-6 text-gray-700">
          No package.json found in your project. It looks like your code files aren't set up yet.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-800">
            <Sparkles className="w-4 h-4 inline mr-2 text-blue-500" />
            Let me help you get started! Describe your app idea and I'll create all the necessary code files for you.
          </p>
        </div>
        <p className="text-xs text-gray-600">
          Tell me what kind of app you want to build and I'll generate a complete working example with all the files you need!
        </p>
      </div>
    </div>
  );
};

export default PreviewNoFilesState;
