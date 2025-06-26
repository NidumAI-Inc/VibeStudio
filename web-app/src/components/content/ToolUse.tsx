
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Terminal } from "lucide-react";

interface ToolUseProps {
  item: {
    name?: string;
    input?: any;
  };
}

const ToolUse = ({ item }: ToolUseProps) => {
  return (
    <Card className="bg-blue-900/20 border-blue-500/30 p-3">
      <div className="flex items-center gap-2 mb-2">
        <Terminal className="w-4 h-4 text-blue-400" />
        <Badge variant="outline" className="text-blue-400 border-blue-400">
          {item.name || 'Tool'}
        </Badge>
      </div>
      {item.input && (
        <SyntaxHighlighter
          language="json"
          style={vscDarkPlus}
          customStyle={{
            margin: '0',
            borderRadius: '4px',
            fontSize: '12px'
          } as { [key: string]: string }}
        >
          {JSON.stringify(item.input, null, 2)}
        </SyntaxHighlighter>
      )}
    </Card>
  );
};

export default ToolUse;
