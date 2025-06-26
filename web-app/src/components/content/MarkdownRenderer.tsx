import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import ReactMarkdown from 'react-markdown'

interface MarkdownRendererProps {
  content: string
}

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <div className='text-gray-900 prose prose-gray max-w-none w-full break-words'>
      <ReactMarkdown
        components={{
          code: ({ node, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '')
            const inline = !match
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag='div'
                customStyle={
                  {
                    margin: '0',
                    borderRadius: '4px',
                    fontSize: '12px',
                    width: '100%',
                    maxWidth: '100%',
                    overflowX: 'auto',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                  } as { [key: string]: string }
                }
                {...props}>
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className='bg-gray-100 px-1 py-0.5 rounded text-sm text-gray-900' {...props}>
                {children}
              </code>
            )
          },
          pre: ({ children }) => <div className='bg-gray-100 rounded-lg p-4 overflow-x-auto'>{children}</div>,
          h1: ({ children }) => <h1 className='text-2xl font-bold text-gray-900 mb-4'>{children}</h1>,
          h2: ({ children }) => <h2 className='text-xl font-semibold text-gray-900 mb-3'>{children}</h2>,
          h3: ({ children }) => <h3 className='text-lg font-semibold text-gray-900 mb-2'>{children}</h3>,
          p: ({ children }) => <p className='text-gray-900 mb-3 leading-relaxed'>{children}</p>,
          ul: ({ children }) => <ul className='list-disc list-inside text-gray-900 mb-3 space-y-1'>{children}</ul>,
          ol: ({ children }) => <ol className='list-decimal list-inside text-gray-900 mb-3 space-y-1'>{children}</ol>,
          li: ({ children }) => <li className='text-gray-900'>{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className='border-l-4 border-blue-500 pl-4 italic text-gray-700 mb-3'>{children}</blockquote>
          ),
          strong: ({ children }) => <strong className='font-bold text-gray-900'>{children}</strong>,
          em: ({ children }) => <em className='italic text-gray-700'>{children}</em>,
          a: ({ href, children }) => (
            <a
              href={href}
              className='text-blue-600 hover:text-blue-800 underline'
              target='_blank'
              rel='noopener noreferrer'>
              {children}
            </a>
          ),
        }}>
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownRenderer
