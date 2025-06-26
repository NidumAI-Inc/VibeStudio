
import { ScrollArea } from "@/components/ui/scroll-area";
import { Folder } from "lucide-react";
import { FileItem as FileItemType } from "@/services/api";
import FileItem from "./FileItem";
import NewFileInput from "./NewFileInput";

interface FileExplorerContentProps {
  loading: boolean;
  files: FileItemType[];
  selectedFile: string | null;
  showNewFile: boolean;
  newFileName: string;
  onNewFileNameChange: (name: string) => void;
  onCreateFile: () => void;
  onCancelNewFile: () => void;
  onFileOpen: (filename: string, isDir: boolean) => void;
}

const FileExplorerContent = ({
  loading,
  files,
  selectedFile,
  showNewFile,
  newFileName,
  onNewFileNameChange,
  onCreateFile,
  onCancelNewFile,
  onFileOpen
}: FileExplorerContentProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-600">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          Loading files...
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-1">
        {/* New File Input */}
        {showNewFile && (
          <NewFileInput
            fileName={newFileName}
            onFileNameChange={onNewFileNameChange}
            onCreateFile={onCreateFile}
            onCancel={onCancelNewFile}
          />
        )}
        
        {/* File List */}
        {files.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Folder className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No files in this directory</p>
          </div>
        ) : (
          files.map((file) => (
            <FileItem
              key={file.name}
              file={file}
              isSelected={selectedFile === file.name}
              onClick={onFileOpen}
            />
          ))
        )}
      </div>
    </ScrollArea>
  );
};

export default FileExplorerContent;
