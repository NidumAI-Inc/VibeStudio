import { useEffect, useState, useRef } from 'react'

interface UseSoundNotificationsProps {
  isStreaming: boolean
  messages: any[]
}

export const useSoundNotifications = ({ isStreaming, messages }: UseSoundNotificationsProps) => {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundNotificationsEnabled')
    return saved ? JSON.parse(saved) : true
  })

  const lastAssistantMessageCount = useRef(0)

  // Save sound preference to localStorage
  useEffect(() => {
    localStorage.setItem('soundNotificationsEnabled', JSON.stringify(soundEnabled))
  }, [soundEnabled])

  // Play sound when new assistant message arrives
  useEffect(() => {
    if (!soundEnabled) return

    // Count assistant messages
    const assistantMessages = messages.filter((msg) => msg.role === 'assistant' && msg.content?.trim())
    const currentAssistantCount = assistantMessages.length

    // console.log('🔊 Sound check:', {
    //   soundEnabled,
    //   isStreaming,
    //   currentAssistantCount,
    //   lastAssistantMessageCount: lastAssistantMessageCount.current,
    //   lastMessage: messages[messages.length - 1]
    // });

    // Play sound when we have a new assistant message and streaming has stopped
    if (!isStreaming && currentAssistantCount > lastAssistantMessageCount.current) {
      // console.log('🔊 New assistant message detected, playing sound');
      playNotificationSound()
      lastAssistantMessageCount.current = currentAssistantCount
    }

    // Update count when streaming starts to avoid double notifications
    if (isStreaming) {
      lastAssistantMessageCount.current = currentAssistantCount
    }
  }, [isStreaming, messages.length, soundEnabled])

  const playNotificationSound = () => {
    try {
      // console.log('🔊 Attempting to play notification sound');

      // Create a simple notification sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Resume audio context in case it's suspended (required by browser policies)
      if (audioContext.state === 'suspended') {
        audioContext.resume()
      }

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Create a pleasant notification sound (two-tone chime)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.15)

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.4)

      // console.log('🔊 Notification sound played successfully');
    } catch (error) {
      // console.warn('🔊 Could not play notification sound:', error);
    }
  }

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
    // console.log('🔊 Sound notifications toggled:', !soundEnabled);
  }

  return {
    soundEnabled,
    toggleSound,
  }
}
