import { useState, useEffect } from 'react'

interface ServerStatus {
  isRunning: boolean
  isLoading: boolean
  lastChecked: Date | null
  serverUrl: string
}

export const useServerStatus = () => {
  const [status, setStatus] = useState<ServerStatus>({
    isRunning: false,
    isLoading: true,
    lastChecked: null,
    serverUrl: localStorage.getItem('serverUrl') || 'http://127.0.0.1:4327',
  })

  const checkServerStatus = async (url?: string) => {
    const targetUrl = url || status.serverUrl
    try {
      setStatus((prev) => ({ ...prev, isLoading: true }))

      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        const isRunning = data.status === 'Vibe server is running...'

        setStatus((prev) => ({
          ...prev,
          isRunning,
          isLoading: false,
          lastChecked: new Date(),
          serverUrl: targetUrl,
        }))
      } else {
        setStatus((prev) => ({
          ...prev,
          isRunning: false,
          isLoading: false,
          lastChecked: new Date(),
          serverUrl: targetUrl,
        }))
      }
    } catch (error) {
      // console.log('Server status check failed:', error);
      setStatus((prev) => ({
        ...prev,
        isRunning: false,
        isLoading: false,
        lastChecked: new Date(),
        serverUrl: targetUrl,
      }))
    }
  }

  const updateServerUrl = (newUrl: string) => {
    localStorage.setItem('serverUrl', newUrl)
    setStatus((prev) => ({ ...prev, serverUrl: newUrl }))
    checkServerStatus(newUrl)
  }

  useEffect(() => {
    // Initial check
    checkServerStatus()

    // Set up interval to check every 30 seconds
    const interval = setInterval(() => checkServerStatus(), 30000)

    return () => clearInterval(interval)
  }, [status.serverUrl])

  return {
    ...status,
    refresh: () => checkServerStatus(),
    updateServerUrl,
  }
}
