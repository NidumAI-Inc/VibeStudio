import type { Server } from 'http'
import app from './tts-app'
import logger from '../utils/logger'

const PORT = 40902
let server: Server | null = null

const sockets = new Set<import('net').Socket>()

export async function startTTSService(): Promise<Server> {
  return new Promise((resolve) => {
    server = app.listen(PORT, '127.0.0.1', () => {
      logger.info(`🔊 TTS server running at http://127.0.0.1:${PORT}/api/tts`)
      resolve(server!)
    })

    server.on('connection', (socket) => {
      sockets.add(socket)
      socket.on('close', () => sockets.delete(socket))
    })
  })
}

export async function stopTTSService(): Promise<void> {
  if (server) {
    return new Promise((resolve, reject) => {
      // Force close lingering sockets
      sockets.forEach((socket) => socket.destroy())
      sockets.clear()

      server!.close((err) => {
        if (err) {
          logger.error(`❌ Error closing TTS server: ${err}`)
          reject(err)
        } else {
          logger.info('🔇 TTS server stopped.')
          server = null
          resolve()
        }
      })
    })
  }
}
