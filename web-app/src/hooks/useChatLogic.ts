import { useState, useEffect } from 'react'
import { StreamingActivity } from '@/utils/jsonMessageHandlers'
import { ChatMessage, Turn, UseChatLogicProps } from '@/types/chat'
import { createUserMessage, createAssistantMessage, formatChatHistory } from '@/utils/messageUtils'
import { startChatSession, stopChatSession, loadChatHistoryData } from '@/utils/chatUtils'
import { useMessageState } from './useMessageState'
import { WrittenAction } from '@/types/written-actions'

export const useChatLogic = ({ initialStreamId, onProjectCreated, skipHistory }: UseChatLogicProps) => {
  const [input, setInput] = useState('')

  const [isStreaming, setIsStreaming] = useState(false)

  const [streamingActivity, setStreamingActivity] = useState<StreamingActivity | null>(null)

  const [currentStreamId, setCurrentStreamId] = useState<string | null>(initialStreamId)

  const [turns, setTurns] = useState<Turn[]>([])

  const {
    messages,
    addUserMessage,
    addAssistantMessage,
    updateAssistantMessage,
    replaceAssistantMessage,
    removeLastMessage,
    setAllMessages,
  } = useMessageState()

  useEffect(() => {
    // console.log('[useChatLogic] 🎯 useEffect triggered with', {
    //   initialStreamId,
    //   skipHistory,
    // })

    if (initialStreamId && !skipHistory) {
      loadChatHistory(initialStreamId)
    } else {
      // console.log('[useChatLogic] 🚫 Skipping loadChatHistory')
    }
  }, [initialStreamId, skipHistory])

  const loadChatHistory = async (streamId: string) => {
    try {
      const response = await loadChatHistoryData(streamId)

      const formattedMessages = formatChatHistory(response)
      // console.log(response.turns)
      const enrichedTurns = response.turns.map((turn: any) => {
        const writtenActions: WrittenAction[] = []

        turn.response?.forEach((entry: any) => {
          if (entry.type === 'assistant' && entry.message?.content) {
            entry.message.content.forEach((contentItem: any) => {
              if (contentItem?.type === 'tool_use') {
                const input = contentItem.input || {}

                if (contentItem.name === 'Write' && input.file_path) {
                  writtenActions.push({
                    type: 'write',
                    path: input.file_path,
                    content: input.content,
                  })
                }

                if (contentItem.name === 'Edit' && input.file_path) {
                  writtenActions.push({
                    type: 'edit',
                    path: input.file_path,
                    old_string: input.old_string,
                    new_string: input.new_string,
                  })
                }

                if (contentItem.name === 'Bash' && input.command) {
                  writtenActions.push({
                    type: 'bash',
                    command: input.command,
                  })
                }
              }
            })
          }
        })

        return {
          ...turn,
          writtenActions,
        }
      })

      setTurns(enrichedTurns)

      setAllMessages(formattedMessages)
    } catch (error) {
      // Error handling is done in the utility function
    }
  }

  const addUserMessageToChat = (content: string) => {
    const userMessage = createUserMessage(content)
    return addUserMessage(userMessage)
  }

  const addAssistantMessageToChat = () => {
    const assistantMessage = createAssistantMessage()
    return addAssistantMessage(assistantMessage)
  }

  const startChat = async (prompt: string) => {
    const newStreamId = await startChatSession(prompt, currentStreamId)
    setCurrentStreamId(newStreamId)
    return newStreamId
  }

  const stopStreaming = async () => {
    if (currentStreamId) {
      await stopChatSession(currentStreamId)
      setIsStreaming(false)
      setStreamingActivity(null)
    }
  }

  return {
    messages,
    input,
    setInput,
    isStreaming,
    setIsStreaming,
    streamingActivity,
    setStreamingActivity,
    currentStreamId,
    addUserMessage: addUserMessageToChat,
    addAssistantMessage: addAssistantMessageToChat,
    updateAssistantMessage,
    replaceAssistantMessage,
    removeLastMessage,
    startChat,
    stopStreaming,
    loadChatHistory,
    turns,
  }
}

export type { ChatMessage, StreamingActivity }
