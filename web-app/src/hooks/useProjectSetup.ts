import { useState, useEffect } from 'react'
import { setupService } from '@/services/setupService'
import { toast } from 'sonner'

export const useProjectSetup = () => {
  const [credentials, setCredentials] = useState({
    ANTHROPIC_API_KEY: '',
    GITHUB_USERNAME: '',
    GITHUB_TOKEN: '',
  })
  const [loading, setLoading] = useState(false)
  const [loadingEnv, setLoadingEnv] = useState(true)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    ANTHROPIC_API_KEY: false,
    GITHUB_TOKEN: false,
  })

  const loadCredentials = async () => {
    try {
      setLoadingEnv(true)

      // Try to get environment variables instead of setup credentials
      const envData = await setupService.getEnvironmentVariables()

      if (envData && typeof envData === 'object') {
        const newCredentials = {
          ANTHROPIC_API_KEY: envData.ANTHROPIC_API_KEY || '',
          GITHUB_USERNAME: envData.GITHUB_USERNAME || '',
          GITHUB_TOKEN: envData.GITHUB_TOKEN || '',
        }

        setCredentials(newCredentials)
        setHasUnsavedChanges(false)

        const hasCredentials =
          newCredentials.ANTHROPIC_API_KEY && newCredentials.GITHUB_USERNAME && newCredentials.GITHUB_TOKEN
        if (hasCredentials) {
          toast.success('Settings loaded successfully')
        }
      } else {
        // console.log('No environment data found or invalid format')
      }
    } catch (error) {
      // console.error('Failed to load settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoadingEnv(false)
    }
  }

  const handleSave = async () => {
    if (!credentials.ANTHROPIC_API_KEY || !credentials.GITHUB_USERNAME || !credentials.GITHUB_TOKEN) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      // console.log('Saving credentials...')

      // Use setup endpoint with correct field names
      const setupData = {
        ANTHROPIC_API_KEY: credentials.ANTHROPIC_API_KEY,
        github_username: credentials.GITHUB_USERNAME,
        github_token: credentials.GITHUB_TOKEN,
      }

      await setupService.setupCredentials(setupData)
      // console.log('Credentials saved successfully')

      setHasUnsavedChanges(false)
      toast.success('Settings saved successfully')
    } catch (error: any) {
      // console.error('Failed to save settings:', error)

      // Extract error message from API response
      let errorMessage = 'Failed to save settings'
      if (error && typeof error === 'object') {
        if (error.detail) {
          errorMessage = error.detail
        } else if (error.message) {
          errorMessage = error.message
        }
      }

      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof typeof credentials, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
  }

  const togglePasswordVisibility = (field: 'ANTHROPIC_API_KEY' | 'GITHUB_TOKEN') => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  useEffect(() => {
    loadCredentials()
  }, [])

  return {
    credentials,
    loading,
    loadingEnv,
    hasUnsavedChanges,
    showPasswords,
    loadCredentials,
    handleSave,
    handleInputChange,
    togglePasswordVisibility,
  }
}
