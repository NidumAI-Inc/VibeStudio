
import { Settings } from "lucide-react";

const ProjectSetupHeader = () => {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-6">
        <Settings className="w-8 h-8 text-blue-500" />
      </div>
      <h1 className="text-4xl font-bold text-black mb-4">Project Settings</h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Configure your API credentials and project preferences
      </p>
    </div>
  );
};

export default ProjectSetupHeader;
