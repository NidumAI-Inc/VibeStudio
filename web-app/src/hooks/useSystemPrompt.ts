import { useState, useEffect } from 'react'
import { systemPromptService, SystemPromptResponse } from '@/services/systemPromptService'
import { toast } from 'sonner'

export const useSystemPrompt = () => {
  const [systemPrompt, setSystemPrompt] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const fetchPrompt = async () => {
    try {
      setLoading(true)
      const response = await systemPromptService.getCurrentPrompt()
      setSystemPrompt(response.system_prompt)
    } catch (error) {
      // console.error('Failed to fetch system prompt:', error);
      toast.error('Failed to load system prompt')
    } finally {
      setLoading(false)
    }
  }

  const updatePrompt = async (newPrompt: string) => {
    try {
      setUpdating(true)
      const response = await systemPromptService.updatePrompt(newPrompt)
      setSystemPrompt(response.system_prompt)
      toast.success('System prompt updated successfully')
      return true
    } catch (error) {
      // console.error('Failed to update system prompt:', error);
      toast.error('Failed to update system prompt')
      return false
    } finally {
      setUpdating(false)
    }
  }

  useEffect(() => {
    fetchPrompt()
  }, [])

  return {
    systemPrompt,
    loading,
    updating,
    updatePrompt,
    refreshPrompt: fetchPrompt,
  }
}
