import { StreamConnectionState } from '@/types/streaming'
import { StreamDataProcessor } from './StreamDataProcessor'
import { STREAM_CONFIG, getPollInterval } from './StreamConnectionConfig'
import { WrittenAction } from '@/types/written-actions'

export class StreamPoller {
  private pollTimeout: NodeJS.Timeout | null = null

  constructor(
    private streamUrl: string,
    private abortController: AbortController,
    private dataProcessor: StreamDataProcessor,
    private onComplete: () => void,
    private onError: (error: any) => void,
    private onWriteAction?: (action: WrittenAction) => void
  ) {}

  async startPolling(state: StreamConnectionState): Promise<void> {
    let retryCount = 0
    let noDataCount = 0

    const processStream = async (): Promise<void> => {
      try {
        const response = await fetch(this.streamUrl, {
          signal: this.abortController.signal,
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Cache-Control': 'no-cache',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder('utf-8')
        let fullText = ''
        let buffer = ''
        let done = false

        while (!done && reader) {
          const { value, done: readerDone } = await reader.read()
          done = readerDone

          if (value) {
            const chunk = decoder.decode(value, { stream: true })
            buffer += chunk
            fullText += chunk
            // console.log('📦 [CHUNK RECEIVED]:', chunk)

            let jsonStart = buffer.indexOf('{')
            let openBraces = 0
            let inString = false
            let escapeNext = false
            let jsonEnd = -1

            const findJsonEnd = () => {
              for (let i = jsonStart; i < buffer.length; i++) {
                const char = buffer[i]
                if (inString) {
                  if (escapeNext) {
                    escapeNext = false
                  } else if (char === '\\') {
                    escapeNext = true
                  } else if (char === '"') {
                    inString = false
                  }
                } else {
                  if (char === '"') {
                    inString = true
                  } else if (char === '{') {
                    openBraces++
                  } else if (char === '}') {
                    openBraces--
                    if (openBraces === 0) {
                      return i + 1
                    }
                  }
                }
              }
              return -1
            }

            while ((jsonEnd = findJsonEnd()) > 0) {
              const jsonText = buffer.slice(jsonStart, jsonEnd)
              buffer = buffer.slice(jsonEnd)

              try {
                const parsed = JSON.parse(jsonText)
                const entries = Array.isArray(parsed.response) ? parsed.response : [parsed]

                entries.forEach((entry) => {
                  if (entry.type === 'assistant' && entry.message?.content) {
                    entry.message.content.forEach((contentItem: any) => {
                      if (contentItem?.type === 'tool_use') {
                        const input = contentItem.input || {}

                        if (contentItem.name === 'Write') {
                          const filePath = input.file_path
                          const code = input.content
                          if (filePath) {
                            // console.log('📄 Write file path:', filePath)
                            // console.log('🧠 Write content (code):', code)
                            this.onWriteAction?.({ type: 'write', path: filePath, content: code })
                          }
                        }

                        if (contentItem.name === 'Edit') {
                          const filePath = input.file_path
                          const oldCode = input.old_string
                          const newCode = input.new_string
                          if (filePath) {
                            // console.log('✍️ Edit file path:', filePath)
                            // console.log('🟥 Old code:', oldCode)
                            // console.log('🟩 New code:', newCode)
                            this.onWriteAction?.({
                              type: 'edit',
                              path: filePath,
                              old_string: oldCode,
                              new_string: newCode,
                            })
                          }
                        }
                        if (contentItem.name === 'Bash') {
                          const command = contentItem.input?.command
                          if (command) {
                            // console.log('📄 📄 Bash command:', command)
                            this.onWriteAction?.({ type: 'bash', command })
                          }
                        }
                      }
                    })
                  }
                })
              } catch (err) {
                console.warn('❌ [JSON PARSE ERROR]: Waiting for more data...', err)
              }

              jsonStart = buffer.indexOf('{')
              openBraces = 0
              inString = false
              escapeNext = false
              jsonEnd = -1
            }
          }
        }

        if (fullText.length > 0) {
          state.hasReceivedData = true
          noDataCount = 0
          this.dataProcessor.processJsonContent(fullText, state)
        } else {
          noDataCount++
        }

        const shouldContinue = this.dataProcessor.shouldContinueStreaming(
          fullText,
          noDataCount,
          STREAM_CONFIG.MAX_NO_DATA_ATTEMPTS
        )

        if (shouldContinue) {
          const pollInterval = getPollInterval(noDataCount)
          this.pollTimeout = setTimeout(() => processStream(), pollInterval)
        } else {
          this.onComplete()
        }
      } catch (error: any) {
        if (error.name === 'AbortError') return

        if (error.message?.includes('ERR_INCOMPLETE_CHUNKED_ENCODING') && retryCount < STREAM_CONFIG.MAX_RETRIES) {
          retryCount++
          this.pollTimeout = setTimeout(() => processStream(), 3000)
          return
        }

        if (!state.hasReceivedData && noDataCount < STREAM_CONFIG.TIMEOUT_THRESHOLDS.FIVE_MINUTES) {
          this.onError(error)
        } else {
          if (retryCount < STREAM_CONFIG.MAX_RETRIES) {
            retryCount++
            this.pollTimeout = setTimeout(() => processStream(), 5000)
          } else {
            this.onComplete()
          }
        }
      }
    }

    processStream()
  }

  stop(): void {
    if (this.pollTimeout) {
      clearTimeout(this.pollTimeout)
      this.pollTimeout = null
    }
  }
}
