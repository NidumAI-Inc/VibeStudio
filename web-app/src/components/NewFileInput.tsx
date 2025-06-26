
import { Button } from "@/components/ui/button";
import { File, Save, X } from "lucide-react";

interface NewFileInputProps {
  fileName: string;
  onFileNameChange: (name: string) => void;
  onCreateFile: () => void;
  onCancel: () => void;
}

const NewFileInput = ({ fileName, onFileNameChange, onCreateFile, onCancel }: NewFileInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onCreateFile();
    }
  };

  return (
    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <File className="w-4 h-4 text-blue-500" />
      <input
        type="text"
        value={fileName}
        onChange={(e) => onFileNameChange(e.target.value)}
        placeholder="Enter filename..."
        className="flex-1 bg-transparent text-black placeholder-gray-500 focus:outline-none"
        onKeyPress={handleKeyPress}
        autoFocus
      />
      <Button 
        size="sm" 
        onClick={onCreateFile}
        disabled={!fileName.trim()}
        className="bg-blue-500 text-white hover:bg-blue-600"
      >
        <Save className="w-3 h-3" />
      </Button>
      <Button 
        size="sm" 
        variant="ghost" 
        onClick={onCancel}
        className="text-gray-500 hover:text-black"
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default NewFileInput;
