import MarkdownRenderer from './content/MarkdownRenderer';
import ContentItemRenderer from './content/ContentItemRenderer';

interface MessageContentProps {
  content: any;
  role: 'user' | 'assistant';
}

const MessageContent = ({ content, role }: MessageContentProps) => {
  // console.log('🔍 MESSAGE CONTENT - Rendering content:', { content, type: typeof content, role });
  
  // Handle string content (simple text messages with potential markdown)
  if (typeof content === 'string') {
    // Check if the string starts with [object Object] and clean it
    let cleanContent = content;
    if (content.startsWith('[object Object]')) {
      // console.log('🧹 MESSAGE CONTENT - Detected [object Object] prefix, cleaning...');
      cleanContent = content.replace(/^\[object Object\]/, '').trim();
    }
    
    // console.log('✅ MESSAGE CONTENT - Rendering as string markdown:', cleanContent);
    return <div className="text-gray-900"><MarkdownRenderer content={cleanContent} /></div>;
  }

  // Handle array content (complex messages with multiple parts)
  if (Array.isArray(content)) {
    // console.log('✅ MESSAGE CONTENT - Rendering as array, length:', content.length);
    return (
      <div className="space-y-3 text-gray-900">
        {content.map((item: any, index: number) => {
          // console.log(`📝 MESSAGE CONTENT - Rendering array item ${index}:`, { item, type: typeof item });
          return (
            <div key={index}>
              <ContentItemRenderer item={item} />
            </div>
          );
        })}
      </div>
    );
  }

  // Handle object content (single complex item)
  if (typeof content === 'object' && content !== null) {
    // console.log('✅ MESSAGE CONTENT - Rendering as object:', { content, keys: Object.keys(content) });
    
    // If the object has a text property, render it as markdown
    if (content.text && typeof content.text === 'string') {
      // console.log('✅ MESSAGE CONTENT - Object has text property, rendering as markdown');
      return <div className="text-gray-900"><MarkdownRenderer content={content.text} /></div>;
    }
    
    // If the object has a content property that's an array, render it
    if (content.content && Array.isArray(content.content)) {
      // console.log('✅ MESSAGE CONTENT - Object has content array, recursing');
      return <MessageContent content={content.content} role={role} />;
    }
    
    // If the object has a content property that's a string, render it
    if (content.content && typeof content.content === 'string') {
      // console.log('✅ MESSAGE CONTENT - Object has content string, rendering as markdown');
      return <div className="text-gray-900"><MarkdownRenderer content={content.content} /></div>;
    }
    
    // Otherwise render as ContentItemRenderer
    // console.log('✅ MESSAGE CONTENT - Rendering object through ContentItemRenderer');
    return <div className="text-gray-900"><ContentItemRenderer item={content} /></div>;
  }

  // console.log('⚠️ MESSAGE CONTENT - Falling back to string conversion for:', { content, type: typeof content });
  
  // Fallback - try to convert to string safely
  let fallbackContent = '';
  
  if (content === null || content === undefined) {
    // console.log('❌ MESSAGE CONTENT - Content is null/undefined');
    return <div className="text-gray-900 italic">No content</div>;
  }
  
  // Avoid [object Object] by checking if it has a meaningful string representation
  if (typeof content === 'object') {
    // console.log('❌ MESSAGE CONTENT - Content is object, showing debug info');
    return (
      <div className="bg-gray-100 border border-gray-300 rounded p-3">
        <div className="text-blue-600 text-xs mb-2">Debug: Object content</div>
        <pre className="text-sm text-gray-900 whitespace-pre-wrap overflow-x-auto">
          {JSON.stringify(content, null, 2)}
        </pre>
      </div>
    );
  }
  
  // Safe string conversion
  fallbackContent = String(content);
  
  return <div className="text-gray-900"><MarkdownRenderer content={fallbackContent} /></div>;
};

export default MessageContent;
