import { useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

interface UseNavigationBlockingProps {
  isStreaming: boolean
  warningMessage?: string
}

export const useNavigationBlocking = ({
  isStreaming,
  warningMessage = 'You have an active chat stream in progress. Navigating away will stop the current response. Are you sure you want to continue?',
}: UseNavigationBlockingProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Block back/forward navigation when streaming
  useEffect(() => {
    if (!isStreaming) return

    const handlePopState = (event: PopStateEvent) => {
      // console.log('🚫 Navigation blocked during streaming');

      // Prevent the navigation
      event.preventDefault()

      // Show confirmation dialog
      const confirmNavigation = window.confirm(warningMessage)

      if (confirmNavigation) {
        // If user confirms, allow navigation by pushing the state again
        window.history.pushState(null, '', location.pathname + location.search)
      } else {
        // Stay on current page by pushing current state
        window.history.pushState(null, '', location.pathname + location.search)
      }
    }

    // Add an extra history entry to intercept back navigation
    window.history.pushState(null, '', location.pathname + location.search)

    // Listen for popstate events (back/forward button)
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [isStreaming, warningMessage, location.pathname, location.search])

  // Create a wrapper for navigation that shows warning when streaming
  const safeNavigate = useCallback(
    (to: string, options?: any) => {
      if (isStreaming) {
        const confirmNavigation = window.confirm(warningMessage)
        if (confirmNavigation) {
          navigate(to, options)
        }
      } else {
        navigate(to, options)
      }
    },
    [isStreaming, warningMessage, navigate]
  )

  return {
    safeNavigate,
  }
}
