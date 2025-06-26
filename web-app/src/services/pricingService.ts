// const PRICING_BASE_URL = 'http://127.0.0.1:5001'
import { PRICING_BASE_URL } from './config'

type PricingRequestInit = RequestInit & { token?: string }

const handleResponse = async (response: Response) => {
  if (response.status === 401) {
    // Token expired or invalid – handle logout
    localStorage.clear()
    window.location.href = '/login'
    throw new Error('Unauthorized: Token expired or invalid')
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData?.error || 'Something went wrong')
  }

  return response.json()
}

const authFetch = (url: string, options: PricingRequestInit = {}) => {
  const headers = new Headers(options.headers || {})
  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`)
  }

  return fetch(url, {
    ...options,
    headers,
  }).then(handleResponse)
}

export class PricingService {
  async updatePricing(userId: string, costUsd: number, streamId: string, token: string) {
    return authFetch(`${PRICING_BASE_URL}/api/user/pricing`, {
      method: 'POST',
      token,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        cost_usd: costUsd,
        stream_id: streamId,
      }),
    })
  }

  async getUserTotalCost(userId: string, token: string) {
    return authFetch(`${PRICING_BASE_URL}/api/user/pricing/total`, {
      method: 'POST',
      token,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
      }),
    })
  }

  async getStreamCost(streamId: string) {
    return authFetch(`${PRICING_BASE_URL}/api/pricing/stream/${streamId}`, {
      method: 'GET',
    })
  }
}

export const pricingService = new PricingService()
