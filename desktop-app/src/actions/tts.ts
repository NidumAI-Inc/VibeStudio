// tts.actions.ts
import { root, ttsEndPoints } from '@/services/end-points'

export async function generateTTS(text: string, options?: { voice?: string; speed?: number }) {
  const res = await fetch(`${root.ttsLocalUrl}${ttsEndPoints.generate}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, ...options }),
  })

  if (!res.ok) throw new Error('TTS generation failed')
  return res.json() as Promise<{ fileName: string }>
}

export async function streamTTS(text: string, onChunk: (filename: string) => void, onError?: (err: Error) => void) {
  const controller = new AbortController()

  const res = await fetch(`${root.ttsLocalUrl}${ttsEndPoints.stream}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
    signal: controller.signal,
  })

  const reader = res.body?.getReader()
  const decoder = new TextDecoder()

  if (!reader) return

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value)
      const matches = [...chunk.matchAll(/data:\s*(.*?)\n/g)]
      for (const match of matches) {
        const filename = match[1]?.trim()
        if (filename) onChunk(filename)
      }
    }
  } catch (err) {
    if (onError) onError(err as Error)
  }

  return () => controller.abort()
}

export async function deleteTTSFolder(folderPath = 'audio') {
  await fetch(`${root.ttsLocalUrl}${ttsEndPoints.delete}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folderPath }),
  })
}
