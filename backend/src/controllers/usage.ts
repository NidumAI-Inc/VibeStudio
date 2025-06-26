import type { Context } from "hono";

import { getStartOfCurrentMonth } from "../utils/common.js";
import Usage from "../models/usage.js";

export async function getUsages(c: Context) {
  const { _id } = c.get("user")
  const { type } = c.req.param()

  const usages = await Usage
    .find({ userId: _id, type })
    .select("-userId -type -createdAt -__v")
    .sort({ month: -1 })
    .lean()

  return c.json(usages)
}

export async function getUsagesOverview(c: Context) {
  const { _id } = c.get("user")
  const { type } = c.req.param()

  const usages = await Usage.aggregate([
    { $match: { userId: _id, type } },
    {
      $group: {
        _id: { serverId: "$serverId", },
        totalBandWidthIn: { $sum: "$bandWidthIn" },
        totalBandWidthOut: { $sum: "$bandWidthOut" },
      }
    },
    {
      $project: {
        _id: 0,
        totalBandWidthIn: 1,
        totalBandWidthOut: 1,
        serverId: "$_id.serverId",
      }
    }
  ])

  return c.json(usages)
}

export async function getUsagesByServer(c: Context) {
  const { _id } = c.get("user")
  const { serverId, type } = c.req.param()

  const usages = await Usage
    .find({ userId: _id, serverId, type })
    .select("-userId -type -serverId -createdAt -__v")
    .sort({ month: -1 })
    .lean()

  return c.json(usages)
}

export async function updateUsage(c: Context) {
  const { _id } = c.get("user")

  const { bandWidthIn, bandWidthOut, serverId, type, month: monthQuery = "" } = await c.req.json()
  const month = getStartOfCurrentMonth(monthQuery || new Date().toISOString())

  await Usage.findOneAndUpdate({ userId: _id, serverId, month, type }, {
    $inc: {
      bandWidthIn,
      bandWidthOut,
    }
  }, { new: true, upsert: true })

  return c.json({ message: "Usage updated successfully" })
}
