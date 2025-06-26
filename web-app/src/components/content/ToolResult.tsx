
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface ToolResultProps {
  item: {
    is_error?: boolean;
    content?: string;
    output?: string;
  };
}

const ToolResult = ({ item }: ToolResultProps) => {
  const isError = item.is_error || false;
  
  return (
    <Card className={`${isError ? 'bg-red-900/20 border-red-500/30' : 'bg-green-900/20 border-green-500/30'} p-3`}>
      <div className="flex items-center gap-2 mb-2">
        {isError ? (
          <XCircle className="w-4 h-4 text-red-400" />
        ) : (
          <CheckCircle className="w-4 h-4 text-green-400" />
        )}
        <Badge variant="outline" className={`${isError ? 'text-red-400 border-red-400' : 'text-green-400 border-green-400'}`}>
          Tool Result
        </Badge>
      </div>
      <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto">
        {item.content || item.output || 'No output'}
      </pre>
    </Card>
  );
};

export default ToolResult;
