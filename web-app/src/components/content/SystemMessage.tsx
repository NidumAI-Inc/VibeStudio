
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

interface SystemMessageProps {
  item: {
    subtype?: string;
    [key: string]: any;
  };
}

const SystemMessage = ({ item }: SystemMessageProps) => {
  return (
    <Card className="bg-yellow-900/20 border-yellow-500/30 p-3">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-4 h-4 text-yellow-400" />
        <Badge variant="outline" className="text-yellow-400 border-yellow-400">
          System
        </Badge>
        {item.subtype && (
          <Badge variant="outline" className="text-yellow-300 border-yellow-300 text-xs">
            {item.subtype}
          </Badge>
        )}
      </div>
      <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto">
        {JSON.stringify(item, null, 2)}
      </pre>
    </Card>
  );
};

export default SystemMessage;
