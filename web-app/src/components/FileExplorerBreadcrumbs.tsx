
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

interface FileExplorerBreadcrumbsProps {
  streamId: string;
  currentPath: string;
  onNavigate: (path: string) => void;
}

const FileExplorerBreadcrumbs = ({ streamId, currentPath, onNavigate }: FileExplorerBreadcrumbsProps) => {
  const breadcrumbs = currentPath.split('/').filter(Boolean);

  return (
    <div className="flex items-center text-sm text-gray-600 bg-gray-100 rounded-lg p-2 mt-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigate('/')}
        className="p-1 h-auto text-black hover:bg-gray-200 flex items-center gap-1"
      >
        <Home className="w-3 h-3" />
        {streamId}
      </Button>
      {breadcrumbs.map((crumb, index) => (
        <div key={index} className="flex items-center">
          <span className="mx-2 text-gray-400">/</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('/' + breadcrumbs.slice(0, index + 1).join('/'))}
            className="p-1 h-auto text-black hover:bg-gray-200"
          >
            {crumb}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default FileExplorerBreadcrumbs;
