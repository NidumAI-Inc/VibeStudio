
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";
import ToolUse from "./ToolUse";
import ToolResult from "./ToolResult";
import CodeBlock from "./CodeBlock";
import SystemMessage from "./SystemMessage";
import MessageContent from "../MessageContent";

interface ContentItemRendererProps {
  item: any;
}

const ContentItemRenderer = ({ item }: ContentItemRendererProps) => {
  // console.log('🔍 CONTENT ITEM RENDERER - Rendering item:', { item, type: typeof item });
  
  // Handle text content with markdown
  if (item.type === 'text') {
    // console.log('✅ CONTENT ITEM RENDERER - Rendering text:', item.text);
    return <MarkdownRenderer content={item.text} />;
  }

  // Handle tool use (commands being executed)
  if (item.type === 'tool_use') {
    // console.log('✅ CONTENT ITEM RENDERER - Rendering tool use');
    return <ToolUse item={item} />;
  }

  // Handle tool results/outputs
  if (item.type === 'tool_result') {
    // console.log('✅ CONTENT ITEM RENDERER - Rendering tool result');
    return <ToolResult item={item} />;
  }

  // Handle code blocks
  if (item.type === 'code') {
    // console.log('✅ CONTENT ITEM RENDERER - Rendering code block');
    return <CodeBlock item={item} />;
  }

  // Handle system messages
  if (item.type === 'system') {
    // console.log('✅ CONTENT ITEM RENDERER - Rendering system message');
    return <SystemMessage item={item} />;
  }

  // Handle assistant messages with rich content
  if (item.type === 'assistant' && item.message) {
    // console.log('✅ CONTENT ITEM RENDERER - Rendering assistant message');
    return <ContentItemRenderer item={item.message} />;
  }

  // Handle message objects with content array
  if (item.content && Array.isArray(item.content)) {
    // console.log('✅ CONTENT ITEM RENDERER - Rendering message with content array');
    return <MessageContent content={item.content} role="assistant" />;
  }

  // Handle direct string content
  if (typeof item === 'string') {
    // console.log('✅ CONTENT ITEM RENDERER - Rendering string content');
    return <MarkdownRenderer content={item} />;
  }

  // console.log('⚠️ CONTENT ITEM RENDERER - Falling back to JSON display for unknown item type:', { item, keys: Object.keys(item || {}) });
  
  // Fallback for unknown item types
  return (
    <Card className="bg-gray-100 border-gray-300 p-3">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-4 h-4 text-gray-600" />
        <Badge variant="outline" className="text-gray-600 border-gray-400">
          {item.type || 'Unknown'}
        </Badge>
      </div>
      <pre className="text-sm text-gray-900 whitespace-pre-wrap overflow-x-auto">
        {JSON.stringify(item, null, 2)}
      </pre>
    </Card>
  );
};

export default ContentItemRenderer;
