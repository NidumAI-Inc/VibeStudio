import type { WSEvents } from "hono/ws"
import type { Context } from "hono"

import trackUsage from "./track-usage.js"

function socketHandler(c: Context): WSEvents<WebSocket> {
  return {
    onOpen: () => {
      console.log("Socket opened")
    },
    onClose: () => {
      console.log("Socket closed")
    },
    onError: (error) => {
      console.error("Socket error:", error)
    },
    onMessage: async (evt, ws) => {
      const parsed = JSON.parse(evt.data as string)
      if (parsed.type === "track-usage") {
        trackUsage(parsed.data)
      }
    },
  }
}

export default socketHandler
