
import { Button } from "@/components/ui/button";
import { Loader2, Play, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PreviewLoadingStateProps {
  connectionError: boolean;
  countdown: number;
  autoRefreshCount: number;
  onRunApp?: () => void;
  onRefresh: () => void;
}

const PreviewLoadingState = ({
  connectionError,
  countdown,
  autoRefreshCount,
  onRunApp,
  onRefresh
}: PreviewLoadingStateProps) => {
  const progressValue = connectionError ? ((5 - countdown) / 5) * 100 : 0;

  return (
    <div className="flex items-center justify-center h-full text-gray-900">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">🚀 Starting Your App</h3>
          <p className="text-sm text-gray-700 mb-4">
            {connectionError ? 
              `Your application is warming up and will be ready shortly...` :
              "Initializing your development server"
            }
          </p>
        </div>
        
        {connectionError && (
          <div className="mb-6">
            <div className="flex items-center justify-center mb-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
            <Progress value={progressValue} className="h-2 mb-3" />
            <p className="text-xs text-gray-600">
              Auto-refreshing in {countdown} seconds...
            </p>
            
            {autoRefreshCount > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Checking connection (attempt {autoRefreshCount + 1})
              </p>
            )}
          </div>
        )}
        
        {!connectionError && (
          <div className="flex justify-center mb-6">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
            </div>
          </div>
        )}
        
        <div className="flex gap-3 justify-center">
          {connectionError && onRunApp && (
            <Button
              onClick={onRunApp}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              <Play className="w-4 h-4 mr-2" />
              Restart App
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onRefresh}
            className="border-blue-400/30 text-blue-500 hover:bg-blue-500 hover:text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {connectionError ? 'Try Now' : 'Refresh'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewLoadingState;
