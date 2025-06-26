/**
 * Access Control Hook
 *
 * This custom hook manages user access permissions based on API setup status
 * and budget constraints. It determines what features users can access.
 *
 * Key Features:
 * - Checks if API credentials are properly configured
 * - Monitors usage costs against budget limits
 * - Provides granular access control (chat vs files)
 * - Handles token validation and automatic logout
 * - Shows appropriate user notifications
 *
 * Usage:
 * - Call in components that need access control
 * - Returns loading state, permissions, and cost data
 * - Automatically handles invalid token scenarios
 */

import { useState, useEffect } from 'react'
import { setupService, pricingService } from '@/services/api'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'

// TypeScript interface defining the access control state
export interface AccessControlState {
  isLoading: boolean // Whether permissions are being checked
  hasApiSetup: boolean // Whether API credentials are configured
  hasExceededBudget: boolean // Whether user has exceeded spending limit
  totalCost: number // Current total spending
  canChat: boolean // Whether user can use chat features
  canAccessFiles: boolean // Whether user can access file management
}

/**
 * Access Control Hook
 *
 * @param providedUserId - Optional user ID to check (defaults to authenticated user)
 * @returns Access control state and recheck function
 */
export const useAccessControl = (providedUserId?: string) => {
  // Get logout function from auth hook
  const { logout } = useAuth()

  // Get authentication data from Zustand store
  const { userId, token } = useAuthStore()
  // console.log('[AccessControl] Using userId:', userId)

  // Use provided userId or fall back to authenticated user's ID

  // Component state for access control data
  const [state, setState] = useState<AccessControlState>({
    isLoading: true,
    hasApiSetup: false,
    hasExceededBudget: false,
    totalCost: 0,
    canChat: false,
    canAccessFiles: false,
  })

  /**
   * Handle invalid authentication token
   *
   * When the API returns an invalid token error, this function
   * logs out the user and shows an appropriate message.
   */
  const handleInvalidToken = async () => {
    // console.log('Invalid token detected, logging out...')
    toast.error('Session expired. Please log in again.')
    await logout()
  }

  /**
   * Check user access permissions
   *
   * This function performs multiple checks:
   * 1. Validates API setup (credentials configured)
   * 2. Checks budget limits and spending
   * 3. Determines feature access permissions
   * 4. Handles authentication errors
   */
  const checkAccess = async () => {
    // Don't proceed without authentication data
    if (!userId || !token) {
      // console.log('No user ID or token available:', { userId, hasToken: !!token })
      setState((prev) => ({ ...prev, isLoading: false }))
      return
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true }))

      // Check API setup status
      let hasApiSetup = false
      try {
        const envData = await setupService.getEnvironmentVariables()
        // Verify that all required API credentials are present
        hasApiSetup = !!(envData?.ANTHROPIC_API_KEY && envData?.GITHUB_USERNAME && envData?.GITHUB_TOKEN)
      } catch (error) {
        // console.log('API setup check failed:', error)
        hasApiSetup = false
      }

      // Check budget and spending limits
      let totalCost = 0
      let hasExceededBudget = false
      try {
        // console.log('Checking budget for user ID:', userId)
        const costData = await pricingService.getUserTotalCost(userId, token)
        totalCost = costData?.totalCost || 0
        hasExceededBudget = totalCost >= 10 // $10 budget limit
      } catch (error: any) {
        // console.log('Budget check failed:', error)

        // Check if it's an invalid token error and handle appropriately
        if (
          error?.message?.includes('Invalid token') ||
          (error?.status === 400 && error?.response?.error === 'Invalid token')
        ) {
          await handleInvalidToken()
          return
        }
      }

      // Determine feature access based on setup and budget
      const canChat = hasApiSetup && !hasExceededBudget // Chat requires API setup and budget
      const canAccessFiles = hasApiSetup // Files only require API setup

      // Update state with all checked data
      setState({
        isLoading: false,
        hasApiSetup,
        hasExceededBudget,
        totalCost,
        canChat,
        canAccessFiles,
      })

      // Show appropriate user notifications
      if (!hasApiSetup) {
        toast.error('API setup incomplete. Please configure your credentials in Settings.')
      } else if (hasExceededBudget) {
        toast.error(`Usage limit exceeded ($${totalCost.toFixed(2)}/$10.00). Chat functionality is disabled.`)
      }
    } catch (error: any) {
      // console.error('Access control check failed:', error)

      // Handle authentication errors
      if (
        error?.message?.includes('Invalid token') ||
        (error?.status === 400 && error?.response?.error === 'Invalid token')
      ) {
        await handleInvalidToken()
        return
      }

      // On error, deny access to features
      setState((prev) => ({
        ...prev,
        isLoading: false,
        canChat: false,
        canAccessFiles: false,
      }))
    }
  }

  // Check access when component mounts or auth state changes
  useEffect(() => {
    checkAccess()
  }, [userId, token])

  // Return state and manual recheck function
  return {
    ...state,
    recheckAccess: checkAccess,
  }
}
