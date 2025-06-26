import { WrittenAction } from './written-actions'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: any
  timestamp: number
  id?: string
}

export interface UseChatLogicProps {
  initialStreamId: string | null
  onProjectCreated?: () => void
  skipHistory?: boolean
}

export type Turn = {
  chat_id: string
  response: ChatMessage[]
  user_input: string
  writtenActions?: WrittenAction[]
}
