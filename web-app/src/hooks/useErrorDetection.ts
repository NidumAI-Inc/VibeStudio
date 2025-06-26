import { useState, useCallback } from 'react'
import { sessionService } from '@/services/sessionService'

interface ErrorDetectionState {
  hasError: boolean
  errorDetails: {
    install: string
    runtime: string
  } | null
  isChecking: boolean
}

export const useErrorDetection = (streamId: string | null) => {
  const [errorState, setErrorState] = useState<ErrorDetectionState>({
    hasError: false,
    errorDetails: null,
    isChecking: false,
  })

  const checkForErrors = useCallback(async () => {
    if (!streamId) {
      // console.warn('[⚠️ checkForErrors] streamId is null. Aborting check.')
      return
    }

    setErrorState((prev) => ({ ...prev, isChecking: true }))

    try {
      const response = await sessionService.getSessionLogs(streamId, 20)
      // console.log('[📄 Logs Response]', response)

      if (response.success === false) {
        const errorDetails = {
          install: response.install || '',
          runtime: response.runtime || '',
        }

        // console.log('[❌ Errors Found]', errorDetails)

        setErrorState({
          hasError: true,
          errorDetails,
          isChecking: false,
        })
      } else {
        // console.log('[✅ No errors detected]')
        setErrorState({
          hasError: false,
          errorDetails: null,
          isChecking: false,
        })
      }
    } catch (error) {
      // console.error('[🔥 checkForErrors] Failed to fetch logs:', error)
      setErrorState((prev) => ({ ...prev, isChecking: false }))
    }
  }, [streamId])

  const dismissError = useCallback(() => {
    // console.log('[🧹 dismissError] Resetting error state')
    setErrorState({
      hasError: false,
      errorDetails: null,
      isChecking: false,
    })
  }, [])

  return {
    ...errorState,
    checkForErrors,
    dismissError,
  }
}
