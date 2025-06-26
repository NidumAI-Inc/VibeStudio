
import { Button } from "@/components/ui/button";
import { Monitor, Tablet, Smartphone } from "lucide-react";

export type ViewMode = 'desktop' | 'tablet' | 'mobile';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const ViewModeToggle = ({ viewMode, onViewModeChange }: ViewModeToggleProps) => {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 border border-gray-200">
      <Button
        variant={viewMode === 'desktop' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('desktop')}
        className={`h-8 px-2 ${
          viewMode === 'desktop' 
            ? 'bg-blue-500 text-white hover:bg-blue-600' 
            : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
        }`}
      >
        <Monitor className="w-4 h-4" />
      </Button>
      <Button
        variant={viewMode === 'tablet' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('tablet')}
        className={`h-8 px-2 ${
          viewMode === 'tablet' 
            ? 'bg-blue-500 text-white hover:bg-blue-600' 
            : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
        }`}
      >
        <Tablet className="w-4 h-4" />
      </Button>
      <Button
        variant={viewMode === 'mobile' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('mobile')}
        className={`h-8 px-2 ${
          viewMode === 'mobile' 
            ? 'bg-blue-500 text-white hover:bg-blue-600' 
            : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
        }`}
      >
        <Smartphone className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ViewModeToggle;
