import { apiService } from '@/services/api'
import { toast } from 'sonner'

export const startChatSession = async (prompt: string, currentStreamId: string | null) => {
  try {
    // Dynamic import to avoid circular dependencies
    const { useAuthStore } = await import('@/store/authStore')
    const { userId } = useAuthStore.getState()

    // Use authenticated user ID instead of hardcoded value
    const requestData = {
      user_id: userId,
      prompt,
      stream_id: currentStreamId || undefined,
    }

    const response = await apiService.startChat(requestData)

    if (response.stream_id) {
      const newStreamId = response.stream_id
      return newStreamId
    } else {
      throw new Error('No stream_id received from API')
    }
  } catch (error) {
    toast.error('Failed to send message. Please try again.')
    throw error
  }
}

export const stopChatSession = async (streamId: string) => {
  if (streamId) {
    try {
      await apiService.stopChat(streamId)
    } catch (error) {
      // Don't show toast for stop errors as they're not critical
    }
  }
}

export const loadChatHistoryData = async (streamId: string) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await apiService.getChatHistory(streamId)
    return response
  } catch (error: any) {
    // if (error?.message?.includes('404')) {
    //   console.warn(`[loadChatHistoryData] ❌ No history found for streamId: ${streamId}`)
    // } else {
    //   console.error(`[loadChatHistoryData] 💥 Error for streamId ${streamId}:`, error)
    // }
    throw error
  }
}
