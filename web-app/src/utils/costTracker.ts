export const saveCostToAPI = async (costUsd: number, streamId: string) => {
  try {
    const { useAuthStore } = await import('@/store/authStore')

    const { userId, token } = useAuthStore.getState()

    if (!userId || !token) {
      // console.error('❌ No user ID or auth token available for cost tracking')
      return
    }

    // console.log('💰 Saving cost to API:', { userId, costUsd, streamId })

    const { apiService } = await import('@/services/api')

    const response = await apiService.updatePricing(userId, costUsd, streamId, token)
    // console.log('✅ Cost saved successfully:', response)
  } catch (error) {
    // console.error('❌ Failed to save cost to API:', error)
  }
}
