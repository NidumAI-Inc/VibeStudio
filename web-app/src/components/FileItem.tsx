
import { Folder, File } from "lucide-react";
import { FileItem as FileItemType } from "@/services/api";

interface FileItemProps {
  file: FileItemType;
  isSelected: boolean;
  onClick: (filename: string, isDir: boolean) => void;
}

const FileItem = ({ file, isSelected, onClick }: FileItemProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div
      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
        isSelected 
          ? 'bg-blue-500 text-white border border-blue-500' 
          : 'hover:bg-gray-50 border border-transparent text-black'
      }`}
      onClick={() => onClick(file.name, file.is_dir)}
    >
      {file.is_dir ? (
        <Folder className={`w-5 h-5 shrink-0 group-hover:scale-110 transition-transform ${
          isSelected ? 'text-white' : 'text-blue-500'
        }`} />
      ) : (
        <File className={`w-4 h-4 shrink-0 group-hover:scale-110 transition-transform ${
          isSelected ? 'text-white' : 'text-gray-600'
        }`} />
      )}
      
      <div className="flex-1 min-w-0">
        <p className={`truncate font-medium ${
          isSelected ? 'text-white' : 'text-black'
        }`}>
          {file.name}
        </p>
        {!file.is_dir && (
          <p className={`text-xs ${
            isSelected ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {formatFileSize(file.size)}
          </p>
        )}
      </div>
      
      {isSelected && (
        <div className="w-2 h-2 bg-white rounded-full shrink-0"></div>
      )}
    </div>
  );
};

export default FileItem;
