
import { RefreshCw } from "lucide-react";

const ProjectSetupLoading = () => {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-2xl mb-6">
            <RefreshCw className="w-8 h-8 animate-spin text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Loading Settings</h1>
          <p className="text-gray-400">Please wait while we load your configuration...</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectSetupLoading;
