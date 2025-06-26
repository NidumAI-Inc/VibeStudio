import { useState } from 'react'
import { ChatMessage } from '@/types/chat'

export const useMessageState = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const addUserMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message])
    return message
  }

  const addAssistantMessage = (message: ChatMessage) => {
    let messageIndex = -1
    setMessages((prev) => {
      const newMessages = [...prev, message]
      messageIndex = newMessages.length - 1
      return newMessages
    })
    return () => messages.length
  }

  const updateAssistantMessage = (index: number | ((prev: ChatMessage[]) => ChatMessage[]), content?: string) => {
    if (typeof index === 'function') {
      setMessages((prev) => index(prev))
      return
    }

    setMessages((prev) => {
      if (index >= 0 && index < prev.length) {
        return prev.map((msg, idx) => {
          if (idx === index) {
            let newContent = msg.content
            if (typeof newContent === 'object') newContent = ''
            if (typeof content === 'string') newContent = newContent + content
            return { ...msg, content: newContent }
          }
          return msg
        })
      }
      return prev
    })
  }

  const replaceAssistantMessage = (index: number, message: ChatMessage) => {
    setMessages((prev) => {
      if (index >= 0 && index < prev.length) {
        let cleanMessage = { ...message }
        if (typeof cleanMessage.content === 'string' && cleanMessage.content.includes('[object Object]')) {
          cleanMessage.content = cleanMessage.content.replace(/\[object Object\]/g, '').trim()
        }
        return prev.map((msg, idx) => (idx === index ? cleanMessage : msg))
      }
      return prev
    })
  }

  const removeLastMessage = () => {
    setMessages((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev))
  }

  const setAllMessages = (newMessages: ChatMessage[]) => {
    setMessages(newMessages)
  }

  return {
    messages,
    addUserMessage,
    addAssistantMessage,
    updateAssistantMessage,
    replaceAssistantMessage,
    removeLastMessage,
    setAllMessages,
  }
}
