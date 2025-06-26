import Usage from "../models/usage.js"
import { getStartOfCurrentMonth } from "../utils/common.js"

type dataT = {
  id: string
  types: string[]
  userId: string
  uploadMbps: number
  downloadMbps: number
}[]

async function trackUsage(data: dataT) {
  if (!data || !data.length) return

  const month = getStartOfCurrentMonth(new Date().toISOString())

  const bulkOps = []

  for (const entry of data) {
    const { id: serverId, userId, uploadMbps, downloadMbps, types } = entry

    for (const type of types) {
      if (!["nativenode", "domain"].includes(type)) {
        continue
      }

      bulkOps.push({
        updateOne: {
          filter: { userId, serverId, month, type },
          update: {
            $inc: {
              bandWidthIn: downloadMbps,
              bandWidthOut: uploadMbps,
            }
          },
          upsert: true
        }
      })
    }
  }

  if (bulkOps.length > 0) {
    await Usage.bulkWrite(bulkOps)
  }
}

export default trackUsage