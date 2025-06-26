import { BASE_URL } from './config'

export class SessionService {
  async runApp(streamId: string, script = 'dev', port = 3455) {
    // console.log('🚀 sessionService.runApp called with:', { streamId, script, port })
    // console.log('🚀 Making request to:', `${BASE_URL}/session/run-app/${streamId}`)

    const formData = new FormData()
    formData.append('script', script)
    formData.append('port', port.toString())

    // console.log('🚀 FormData contents:', { script, port: port.toString() })

    try {
      const response = await fetch(`${BASE_URL}/session/run-app/${streamId}`, {
        method: 'POST',
        body: formData,
      })

      // console.log('🚀 Response status:', response.status)
      // console.log('🚀 Response ok:', response.ok)

      const result = await response.json()
      // console.log('🚀 Response JSON:', result)

      return result
    } catch (error) {
      console.error('❌ Error in runApp API call:', error)
      throw error
    }
  }

  async killApp(streamId: string) {
    // console.log('🛑 Killing app on port 3455');
    const response = await fetch(`${BASE_URL}/kill-port/3455`, {
      method: 'POST',
    })
    return response.json()
  }

  async getSessionLogs(streamId: string, tail?: number) {
    const params = tail ? `?tail=${tail}` : ''
    const response = await fetch(`${BASE_URL}/session/logs/${streamId}${params}`)
    return response.json()
  }
}

export const sessionService = new SessionService()
