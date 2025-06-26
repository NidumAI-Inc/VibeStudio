import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null // JWT token for API authentication
  email: string | null // User's email address
  userId: string | null // Unique user identifier
  isAuthenticated: boolean // Flag to check if user is logged in

  // Action to set user credentials after successful login
  setCredentials: (credentials: { token: string; email: string; userId: string }) => void

  // Action to clear user data on logout
  logout: () => void
}

/**
 * Create the auth store with Zustand
 *
 * The store is wrapped with persist middleware to automatically save/restore
 * state to/from localStorage with the key 'auth-storage'
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state - all values are null/false for unauthenticated user
      token: null,
      email: null,
      userId: null,
      isAuthenticated: false,

      /**
       * Set user credentials after successful authentication
       * Called from login components when user successfully authenticates
       */
      setCredentials: (credentials) => {
        set({
          token: credentials.token,
          email: credentials.email,
          userId: credentials.userId,
          isAuthenticated: true,
        })
      },

      /**
       * Clear all authentication data
       * Called when user logs out or session expires
       */
      logout: () => {
        set({
          token: null,
          email: null,
          userId: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      // Configuration for persistence
      name: 'auth-storage', // localStorage key name
    }
  )
)
