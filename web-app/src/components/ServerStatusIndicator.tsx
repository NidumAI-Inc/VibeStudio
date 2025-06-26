
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Server, Settings, Check, X } from "lucide-react";
import { useState } from "react";
import { useServerStatus } from "@/hooks/useServerStatus";

const ServerStatusIndicator = () => {
  const { isRunning, isLoading, serverUrl, refresh, updateServerUrl } = useServerStatus();
  const [isEditing, setIsEditing] = useState(false);
  const [editUrl, setEditUrl] = useState(serverUrl);

  const handleSave = () => {
    updateServerUrl(editUrl);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditUrl(serverUrl);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        <Server className="w-4 h-4 text-gray-400" />
        <Badge 
          variant={isRunning ? "default" : "destructive"}
          className={`text-xs ${
            isRunning 
              ? "bg-green-500 text-white hover:bg-green-600" 
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          {isLoading ? "Checking..." : isRunning ? "Running" : "Not Running"}
        </Badge>
      </div>
      
      {isEditing ? (
        <div className="flex items-center space-x-1">
          <Input
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
            className="h-6 text-xs w-32 bg-gray-800 border-gray-600 text-white"
            placeholder="Server URL"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className="h-6 w-6 p-0 text-green-400 hover:text-green-300"
          >
            <Check className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            disabled={isLoading}
            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
          >
            <Settings className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={refresh}
            disabled={isLoading}
            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ServerStatusIndicator;
