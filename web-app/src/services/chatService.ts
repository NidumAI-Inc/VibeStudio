import { BASE_URL } from './config'
import { ChatStartRequest } from './types'

const useLocalStream = import.meta.env.VITE_USE_LOCAL_STREAM === 'true'

export class ChatService {
  async startChat(request: ChatStartRequest) {
    const response = await fetch(`${BASE_URL}/chat/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
    return response.json()
  }

  getStreamUrl(streamId: string) {
    // return `${BASE_URL}/stream-jsonl`
    return `${BASE_URL}/chat/stream/${streamId}`
  }

  async stopChat(streamId: string) {
    const response = await fetch(`${BASE_URL}/chat/stop/${streamId}`, {
      method: 'POST',
    })
    return response.json()
  }

  async getChatHistory(streamId: string) {
    const response = await fetch(`${BASE_URL}/chat/history/${streamId}`)

    return response.json()
  }
}

export const chatService = new ChatService()

// const response = await fetch(`${BASE_URL}/chat/history/${streamId}`)

//     if (!response.ok || !response.body) {
//       throw new Error(`Failed to fetch chat history: ${response.statusText}`)
//     }

//     const reader = response.body.getReader()
//     const decoder = new TextDecoder('utf-8')
//     let partialChunk = ''

//     while (true) {
//       const { done, value } = await reader.read()
//       if (done) break

//       const chunk = decoder.decode(value, { stream: true })
//       partialChunk += chunk

//       // Example: split by newlines (or other delimiter depending on your backend)
//       const messages = partialChunk.split('\n')
//       partialChunk = messages.pop() || ''

//       for (const message of messages) {
//         try {
//           const parsed = JSON.parse(message)
//           console.log('[chat-stream]', parsed)
//         } catch (e) {
//           console.warn('[chat-stream] Failed to parse message:', message)
//         }
//       }
//     }

//     if (partialChunk) {
//       try {
//         const parsed = JSON.parse(partialChunk)
//         console.log('[chat-stream]', parsed)
//       } catch (e) {
//         console.warn('[chat-stream] Failed to parse last chunk:', partialChunk)
//       }
//     }
//     return response.json()
//   }
