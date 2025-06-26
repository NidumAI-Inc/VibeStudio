import type { Context } from 'hono'
import User from '../models/user.js'

export const updatePricing = async (c: Context) => {
  try {
    const { user_id, cost_usd, stream_id } = await c.req.json()

    if (cost_usd <= 0) {
      return c.json({ message: 'Invalid cost' }, 400)
    }

    const user = await User.findById(user_id)
    if (!user) {
      return c.json({ message: 'User not found' }, 404)
    }

    const newTotal = user.totalUsage + cost_usd

    if (newTotal > 10) {
      return c.json({ message: 'User limit exceeded (10 USD)' }, 400)
    }

    user.totalUsage = parseFloat(newTotal.toFixed(6))

    if (user.streamCosts.has(stream_id)) {
      const previous = user.streamCosts.get(stream_id)!
      const updated = parseFloat((previous + cost_usd).toFixed(6))
      user.streamCosts.set(stream_id, updated)
    } else {
      const initial = parseFloat(cost_usd.toFixed(6))
      user.streamCosts.set(stream_id, initial)
    }

    await user.save()

    return c.json({ message: 'Pricing updated successfully', totalUsage: user.totalUsage }, 200)
  } catch (error) {
    return c.json({ message: 'Internal server error' }, 500)
  }
}

export const getUserTotalCost = async (c: Context) => {
  try {
    const { user_id } = await c.req.json()

    if (!user_id) {
      return c.json({ message: 'User not authenticated' }, 401)
    }

    const user = await User.findById(user_id)
    if (!user) {
      return c.json({ message: 'User not found' }, 404)
    }

    const USAGE_LIMIT_USD = 10
    const totalUsage = user.totalUsage

    if (totalUsage >= USAGE_LIMIT_USD) {
      return c.json(
        {
          message: 'User limit exceeded (10 USD)',
          code: 'LIMIT_EXCEEDED',
        },
        403
      )
    }

    return c.json(
      {
        user_id,
        totalCost: user.totalUsage,
      },
      200
    )
  } catch (error) {
    return c.json({ message: 'Internal server error' }, 500)
  }
}

export const getStreamCost = async (c: Context) => {
  try {
    const user_id = c.get('user')?.id
    const { stream_id } = c.req.param()

    if (!user_id) {
      return c.json({ message: 'User not authenticated' }, 401)
    }

    const user = await User.findById(user_id)
    if (!user) {
      return c.json({ message: 'User not found' }, 404)
    }

    const streamCost = user.streamCosts.get(stream_id)
    if (streamCost === undefined) {
      return c.json({ message: `No cost found for stream ID ${stream_id}` }, 404)
    }

    return c.json(
      {
        stream_id,
        cost: streamCost,
      },
      200
    )
  } catch (error) {
    return c.json({ message: 'Internal server error' }, 500)
  }
}
