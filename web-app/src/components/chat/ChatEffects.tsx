import { useEffect, useRef } from 'react'

interface ChatEffectsProps {
  initialPrompt?: string
  currentStreamId: string | null
  messages: any[]
  isStreaming: boolean
  streamId: string | null

  handleSendMessage: (message: string) => void
  setInput: (value: string) => void
}

const ChatEffects = ({
  initialPrompt,
  currentStreamId,
  messages,
  isStreaming,
  streamId,
  handleSendMessage,
  setInput,
}: ChatEffectsProps) => {
  // 🛡️ Prevent double-invocation of initial prompt
  const hasSentInitialPrompt = useRef(false)

  // 🚀 Auto-send initial prompt once (if present and new chat)
  useEffect(() => {
    if (initialPrompt && !currentStreamId && messages.length === 0 && !hasSentInitialPrompt.current) {
      hasSentInitialPrompt.current = true
      setInput(initialPrompt)
      setTimeout(() => {
        handleSendMessage(initialPrompt)
      }, 100)
    }
  }, [initialPrompt, currentStreamId, messages.length, handleSendMessage, setInput])

  // ✨ Focus the input field when an existing chat is loaded
  useEffect(() => {
    if (currentStreamId && messages.length > 0) {
      const inputElement = document.querySelector('input[placeholder*="message"]') as HTMLInputElement

      if (inputElement) {
        inputElement.focus()
      }
    }
  }, [currentStreamId, messages.length])

  return null // This component only runs side effects
}

export default ChatEffects
