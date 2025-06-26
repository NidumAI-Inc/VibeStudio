import { Router } from "express";
import { detect } from 'detect-port';

import isLiveCheck from "../utils/is-live-check";

const router = Router()

router.post("/check-port", async (req, res) => {
  try {
    const port = req.body.port
    const realPort = await detect(Number(port))

    const inUse = Number(realPort) !== Number(port)
    res.json({ inUse })

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
})

router.get("/check-lamp-live", async (req, res) => {
  try {
    const port = req.query.port
    const isLive = await isLiveCheck(`http://localhost:${port}/phpmyadmin`)
    res.json({ isLive })

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
})

export default router
