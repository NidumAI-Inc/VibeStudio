const BASE_URL = 'https://nativenode.link.nativenode.host:5633/api'
// const BASE_URL = 'http://localhost:5001/api'

export const apiKeyService = {
  async getAnthropicApiKey(token: string): Promise<{ key: string; masked: string }> {
    const res = await fetch(`${BASE_URL}/user/api-key/anthropic`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      throw new Error('Failed to fetch Anthropic API key')
    }

    return res.json()
  },
}
