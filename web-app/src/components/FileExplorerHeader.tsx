
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { FolderOpen, Plus, Upload } from "lucide-react";

interface FileExplorerHeaderProps {
  onShowNewFile: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileExplorerHeader = ({ onShowNewFile, onFileUpload }: FileExplorerHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <CardTitle className="text-black flex items-center gap-2">
        <FolderOpen className="w-5 h-5 text-blue-500" />
        File Explorer
      </CardTitle>
      <div className="flex space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onShowNewFile}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <Plus className="w-4 h-4 mr-1" />
          New File
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => document.getElementById('file-upload')?.click()}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <Upload className="w-4 h-4 mr-1" />
          Upload
        </Button>
        <input
          id="file-upload"
          type="file"
          onChange={onFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default FileExplorerHeader;
