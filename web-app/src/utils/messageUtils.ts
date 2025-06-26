import { ChatMessage } from '@/types/chat'

export const createUserMessage = (content: string): ChatMessage => {
  return {
    role: 'user',
    content,
    timestamp: Date.now(),
  }
}

export const createAssistantMessage = (): ChatMessage => {
  return {
    role: 'assistant',
    content: '',
    timestamp: Date.now(),
  }
}

export const formatChatHistory = (response: any): ChatMessage[] => {
  if (!response || !response.turns || !Array.isArray(response.turns)) {
    return []
  }

  const formattedMessages: ChatMessage[] = []

  response.turns.forEach((turn: any, index: number) => {
    if (turn.user_input) {
      formattedMessages.push({
        id: turn.chat_id,
        role: 'user',
        content: turn.user_input,
        timestamp: Date.now() - (response.turns.length - index) * 1000,
      })

      if (turn.response && Array.isArray(turn.response)) {
        const resultResponse = turn.response.find((item: any) => item.type === 'result' && item.result)

        if (resultResponse && resultResponse.result) {
          formattedMessages.push({
            id: turn.chat_id,
            role: 'assistant',
            content: resultResponse.result,
            timestamp: Date.now() - (response.turns.length - index - 1) * 1000,
          })
        } else {
          formattedMessages.push({
            id: turn.chat_id,
            role: 'assistant',
            content: turn.response,
            timestamp: Date.now() - (response.turns.length - index - 1) * 1000,
          })
        }
      }
    }
  })

  return formattedMessages
}
