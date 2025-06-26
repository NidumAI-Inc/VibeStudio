import { Button } from '@/components/ui/button'
import { Send, Square } from 'lucide-react'

interface MessageInputProps {
  input: string
  setInput: (value: string) => void
  isStreaming: boolean
  onSendMessage: () => void
  onStopStreaming: () => void
}

const MessageInput = ({ input, setInput, isStreaming, onSendMessage, onStopStreaming }: MessageInputProps) => {
  return (
    <div className='relative'>
      <input
        type='text'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            if (!isStreaming && input.trim()) {
              onSendMessage()
            }
          }
        }}
        placeholder='Ask VibeStudio...'
        className='w-full bg-white border-2 border-blue-200 rounded-full px-6 py-4 pr-14 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base'
        disabled={isStreaming}
      />

      {isStreaming ? (
        <Button
          onClick={onStopStreaming}
          variant='ghost'
          size='icon'
          className='absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full'>
          <Square className='w-4 h-4' />
        </Button>
      ) : (
        <Button
          onClick={onSendMessage}
          disabled={!input.trim()}
          variant='ghost'
          size='icon'
          className='absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full disabled:opacity-30'>
          <Send className='w-4 h-4' />
        </Button>
      )}
    </div>
  )
}

export default MessageInput
