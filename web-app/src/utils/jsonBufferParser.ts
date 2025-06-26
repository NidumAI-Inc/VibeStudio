export class JsonBufferParser {
  private buffer: string = ''

  addToBuffer(content: string): void {
    this.buffer += content
  }

  parseJsonObjects(onJsonParsed: (parsedData: any) => void): void {
    let startIndex = 0
    let braceCount = 0
    let inString = false
    let escapeNext = false
    for (let i = 0; i < this.buffer.length; i++) {
      const char = this.buffer[i]

      if (escapeNext) {
        escapeNext = false
        continue
      }

      if (char === '\\') {
        escapeNext = true
        continue
      }

      if (char === '"') {
        inString = !inString
        continue
      }

      if (!inString) {
        if (char === '{') {
          braceCount++
          if (braceCount === 1) {
            //
          }
        } else if (char === '}') {
          braceCount--

          if (braceCount === 0) {
            const jsonStr = this.buffer.substring(startIndex, i + 1).trim()

            if (jsonStr) {
              try {
                const parsedData = JSON.parse(jsonStr)
                onJsonParsed(parsedData)
              } catch (parseError) {
                //
              }
            }

            startIndex = i + 1
          }
        }
      }
    }

    if (startIndex > 0) {
      const removedContent = this.buffer.substring(0, startIndex)
      this.buffer = this.buffer.substring(startIndex)
    } else {
      // console.log('📝 JSON BUFFER - No content processed, buffer unchanged')
    }
  }

  clearBuffer(): void {
    this.buffer = ''
  }
}
