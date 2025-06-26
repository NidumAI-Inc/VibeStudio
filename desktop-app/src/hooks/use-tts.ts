import { streamTTS } from '@/actions/tts'
import { useEffect, useRef } from 'react'

export function useStreamTTS(text: string, onFile: (file: string) => void, options?: { enabled?: boolean }) {
  const controllerRef = useRef<() => void | null>(null)

  useEffect(() => {
    if (!text || options?.enabled === false) return

    streamTTS(text, onFile).then((abort) => {
      controllerRef.current = abort
    })

    return () => controllerRef.current?.()
  }, [text, options?.enabled])
}
