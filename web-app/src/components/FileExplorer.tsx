
import { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FileItem } from "@/services/api";
import FileExplorerHeader from './FileExplorerHeader';
import FileExplorerBreadcrumbs from './FileExplorerBreadcrumbs';
import FileExplorerContent from './FileExplorerContent';

interface FileExplorerProps {
  streamId: string;
  files: FileItem[];
  currentPath: string;
  selectedFile: string | null;
  loading: boolean;
  onNavigate: (path: string) => void;
  onFileOpen: (filename: string, isDir: boolean) => void;
  onCreateFile: (fileName: string) => void;
  onUploadFile: (file: File) => void;
}

const FileExplorer = ({
  streamId,
  files,
  currentPath,
  selectedFile,
  loading,
  onNavigate,
  onFileOpen,
  onCreateFile,
  onUploadFile
}: FileExplorerProps) => {
  const [newFileName, setNewFileName] = useState('');
  const [showNewFile, setShowNewFile] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUploadFile(file);
    }
  };

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      onCreateFile(newFileName);
      setNewFileName('');
      setShowNewFile(false);
    }
  };

  const handleCancelNewFile = () => {
    setShowNewFile(false);
    setNewFileName('');
  };

  return (
    <Card className="bg-white border-gray-200 h-full flex flex-col">
      {/* Header */}
      <CardHeader className="bg-white border-b border-gray-200 shrink-0">
        <FileExplorerHeader
          onShowNewFile={() => setShowNewFile(true)}
          onFileUpload={handleFileUpload}
        />
        
        {/* Breadcrumbs */}
        <FileExplorerBreadcrumbs
          streamId={streamId}
          currentPath={currentPath}
          onNavigate={onNavigate}
        />
      </CardHeader>
      
      {/* Content */}
      <CardContent className="flex-1 p-0 overflow-hidden">
        <FileExplorerContent
          loading={loading}
          files={files}
          selectedFile={selectedFile}
          showNewFile={showNewFile}
          newFileName={newFileName}
          onNewFileNameChange={setNewFileName}
          onCreateFile={handleCreateFile}
          onCancelNewFile={handleCancelNewFile}
          onFileOpen={onFileOpen}
        />
      </CardContent>
    </Card>
  );
};

export default FileExplorer;
