
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code } from "lucide-react";

interface CodeBlockProps {
  item: {
    language?: string;
    code?: string;
    content?: string;
  };
}

const CodeBlock = ({ item }: CodeBlockProps) => {
  return (
    <Card className="bg-gray-900/50 border-gray-600/30 p-3">
      <div className="flex items-center gap-2 mb-2">
        <Code className="w-4 h-4 text-purple-400" />
        <Badge variant="outline" className="text-purple-400 border-purple-400">
          {item.language || 'Code'}
        </Badge>
      </div>
      <SyntaxHighlighter
        language={item.language || 'text'}
        style={vscDarkPlus}
        customStyle={{
          margin: '0',
          borderRadius: '4px',
          fontSize: '12px'
        } as { [key: string]: string }}
      >
        {item.code || item.content || ''}
      </SyntaxHighlighter>
    </Card>
  );
};

export default CodeBlock;
