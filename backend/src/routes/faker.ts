import type { Context } from 'hono'
import { Hono } from 'hono'
import 'dotenv/config'

import { randomUsage, type usageT } from '../controllers/faker.js'
import { authMiddleware } from '../middlewares/auth.js'
import Usage from '../models/usage.js'

const fakerRoutes = new Hono()

fakerRoutes.use(authMiddleware)

fakerRoutes
  .post('/usage', async (c: Context) => {
    if (process.env.NODE_ENV === 'production') return c.json({ message: 'This route is only available in development mode' }, 400)

    const { _id } = c.get("user")
    const payload = randomUsage()

    const usages = payload?.reduce((acc: (usageT & { userId: string })[], usage: usageT) => {
      const foundIndex = acc.findIndex(s => s?.month === usage?.month && s?.serverId === usage?.serverId && s?.type === usage?.type)
      if (foundIndex !== -1) {
        acc[foundIndex] = {
          ...acc[foundIndex],
          bandWidthIn: acc[foundIndex].bandWidthIn + usage.bandWidthIn,
          bandWidthOut: acc[foundIndex].bandWidthOut + usage.bandWidthOut,
        }
      } else {
        acc.push({
          ...usage,
          userId: _id,
        })
      }
      return acc
    }, [])

    const insertedUsages = await Usage.insertMany(usages)

    return c.json(insertedUsages)
  })

export default fakerRoutes
