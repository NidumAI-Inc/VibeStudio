import { fileURLToPath } from "url";
import { Router } from "express";
import axios from "axios";
import path from "path";
import fs from 'fs/promises';
import os from "os";

import { execPromise, runCommandInBg } from "../utils/run-command";
import { createPath } from "../utils/path-helper";
import logger from "../utils/logger";

const router = Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const domainBase = "http://domainmap.nativenode.host:8000/domains"

const SERVER_PORT = 7000
const SERVER_IP = "54.255.209.73"
const TOKEN = "REPLACE_WITH_A_LONG_RANDOM_TOKEN"

router.get("/", async (req, res) => {
  try {
    const { domain } = req.query

    if (!domain) {
      res.status(400).json({ message: "domain is required" })
      return
    }

    const data = await axios.get(`${domainBase}/${domain}`).then(r => r.data)
    res.json(data)

  } catch (error) {
    console.log(error)
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    res.status(500).json({ error: error.message })
  }
})

router.post("/", async (req, res) => {
  try {
    const { domain, user_id } = req.body

    if (!domain || !user_id) {
      res.status(400).json({ message: "domain and user_id are required" })
      return
    }

    const data = await axios.post(domainBase, {
      domain,
      user_id
    }).then(r => r.data)

    res.json(data)

  } catch (error) {
    console.log(error)
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    res.status(500).json({ error: error.message })
  }
})

router.post("/create-file", async (req, res) => {
  try {
    const { domain, port } = req.body

    if (!domain || !port) {
      res.status(400).json({ message: "domain and port are required" })
      return
    }

    const safeName = domain.replace(/[^\w.-]/g, "_")
    const fileName = `frpc_${safeName}_${port}.ini`
    const filePath = createPath([fileName])

    const iniContent = `
[common]
server_addr = ${SERVER_IP}
server_port = ${SERVER_PORT}
token = ${TOKEN}

[web]
type = http
local_ip = 127.0.0.1
local_port = ${port}
custom_domains = ${domain}
    `.trim()

    await fs.writeFile(filePath, iniContent, "utf-8")

    res.json({ fileName })

  } catch (error) {
    console.log(error)
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    res.status(500).json({ error: error.message })
  }
})

router.post("/start", async (req, res) => {
  try {
    const { domain, port } = req.body

    const safeName = domain.replace(/[^\w.-]/g, "_")
    const fileName = `frpc_${safeName}_${port}.ini`
    const filePath = createPath([fileName])

    const frpcBinary =
      process.env.NODE_ENV === "development"
        ? path.join(__dirname, "..", "public", "bin", "frp")
        : path.join(process.resourcesPath, "bin", "frp")

    const frpcPath = os.platform() === "win32" ? "frpc.exe" : "./frpc"

    const finalPath = path.join(frpcBinary, frpcPath)
    logger.info("frpc path", frpcBinary, frpcPath, finalPath)

    if (os.platform() === "win32") {
      const share = `Start-Process -FilePath ${finalPath} -ArgumentList '-c ${filePath}' -NoNewWindow`
      execPromise(share, { shell: "powershell.exe" })
      logger.info("frpc started", share)

    } else {
      const share = `"${finalPath}" -c ${filePath}`
      await runCommandInBg(share)
      logger.info("frpc started", share)
    }

    res.json({ message: "Success" })

  } catch (error) {
    console.log(error)
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    res.status(500).json({ error: error.message })
  }
})

router.post("/stop", async (req, res) => {
  try {
    const frpcPath = os.platform() === "win32"
      ? "taskkill /F /IM frpc.exe"
      : "pkill frpc"
    await execPromise(frpcPath)
    logger.info("frpc stopped", frpcPath)
    res.json({ message: "Success" })

  } catch (error) {
    console.log(error)
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    res.status(500).json({ error: error.message })
  }
})

router.delete("/", async (req, res) => {
  try {
    const { domain } = req.body

    if (!domain) {
      res.status(400).json({ message: "domain is required" })
      return
    }

    const data = await axios.delete(`${domainBase}/${domain}`).then(r => r.data)
    res.json(data)

  } catch (error) {
    console.log(error)
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    res.status(500).json({ error: error.message })
  }
})

export default router
