
import { Button } from "@/components/ui/button";
import { Save, RefreshCw } from "lucide-react";

interface ProjectSetupActionsProps {
  loading: boolean;
  hasUnsavedChanges: boolean;
  onRefresh: () => void;
  onSave: () => void;
}

const ProjectSetupActions = ({ 
  loading, 
  hasUnsavedChanges, 
  onRefresh, 
  onSave 
}: ProjectSetupActionsProps) => {
  return (
    <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200">
      <Button
        variant="outline"
        onClick={onRefresh}
        className="border-gray-300 hover:bg-gray-100 text-black bg-white"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh
      </Button>
      
      <Button
        onClick={onSave}
        disabled={loading || !hasUnsavedChanges}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 h-12"
      >
        {loading ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </>
        )}
      </Button>
    </div>
  );
};

export default ProjectSetupActions;
