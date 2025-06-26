import { useEffect, useState } from 'react'

export const useInternetStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine)

  useEffect(() => {
    const checkStatus = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener('online', checkStatus)
    window.addEventListener('offline', checkStatus)

    const interval = setInterval(() => {
      setIsOnline(navigator.onLine)
    }, 5000)

    return () => {
      window.removeEventListener('online', checkStatus)
      window.removeEventListener('offline', checkStatus)
      clearInterval(interval)
    }
  }, [])

  return isOnline
}
