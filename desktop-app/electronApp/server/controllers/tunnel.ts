import { fileURLToPath } from "url";
import { promises as fs } from "fs";
import { Router } from "express";
import path from "path";
import os from "os";
import "dotenv/config";

import { readJSON, updateJSONObj, writeJSON } from "../utils/json-helper";
import { execPromise, runCommandInBg } from "../utils/run-command";
import { getTunnelConfigPath } from "../utils/path-helper";
import logger from "../utils/logger";
import delay from "../utils/delay";
import isLiveCheck from "../utils/is-live-check";

const router = Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const tunnelExecutable: Record<string, string> = {
  win32: "native_node_chain.exe",
  darwin: "./native_node_chain",
}

const tunnelStart = tunnelExecutable[os.platform()] || "native_node_chain"

const tunnelBinary =
  process.env.NODE_ENV === "development"
    ? path.join(__dirname, "..", "public", "bin")
    : path.join(process.resourcesPath, "bin")

const stopTunnelCmd =
  os.platform() === "win32" ? "taskkill /F /IM native_node_chain.exe" : "pkill native_node_chain"
const tunnelPath = path.join(tunnelBinary, tunnelStart)

const configPath = getTunnelConfigPath()

router.post("/url-config", async (req, res) => {
  try {
    const config = `${path.join(
      tunnelBinary.replace(/ /g, "\\ "),
      tunnelStart
    )} config set apiEndpoint https://api.link.nativenode.host`
    await execPromise(config)
    await updateJSONObj(configPath, { "url-config": true })

    logger.info("url-config setted", config)
    res.json({ msg: "Success" })

  } catch (error) {
    console.log(error)
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    res.status(500).json({ error: error.message })
  }
})

router.post("/enable", async (req, res) => {
  try {
    const enable = `"${tunnelPath}" enable lVPVpD2IGI8c`
    await execPromise(enable)
    await updateJSONObj(configPath, { "enable": true })

    logger.info("enable setted", enable)
    res.json({ msg: "Success" })

  } catch (error) {
    console.log(error)
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    res.status(500).json({ error: error.message })
  }
})

router.post("/reserve", async (req, res) => {
  try {
    const { id, port } = req.body

    const reserve = `"${tunnelPath}" reserve public http://localhost:${port} --unique-name ${id}`
    await execPromise(reserve)

    logger.info("reserve setted", reserve)
    res.json({ msg: "Success" })

  } catch (error) {
    console.log(error)
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    res.status(500).json({ error: error.message })
  }
})

router.post("/setup-status", async (req, res) => {
  try {
    const data = await readJSON(configPath)
    res.json(data)

  } catch (error) {
    console.log(error)
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    res.status(500).json({ error: error.message })
  }
})

router.post("/go-public", async (req, res) => {
  try {
    const { id } = req.body

    if (os.platform() === "win32") {
      const share = `Start-Process -FilePath ${tunnelPath} -ArgumentList 'share reserved -p ${id} --headless' -NoNewWindow`
      execPromise(share, { shell: "powershell.exe" })
      logger.info("share setted", share)
    } else {
      const share = `"${tunnelPath}" share reserved -p ${id} --headless`
      await runCommandInBg(share)
      logger.info("share setted", share)
    }

    await delay(5000)

    const isLive = await isLiveCheck(`https://${id}.link.nativenode.host`)
    if (isLive) {
      res.json({ msg: "Success" })
      return
    }

    res.status(400).json({ msg: "not success" })

  } catch (error) {
    console.log(error)
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    res.status(500).json({ error: error.message })
  }
})

router.post("/stop-public", async (req, res) => {
  const { id } = req.body

  try {
    const release = `"${tunnelPath}" release ${id}`
    await execPromise(release)
    logger.info("release setted", release)
    res.json({ msg: "Success" })

  } catch (error) {
    console.log(error)
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    res.status(500).json({ error: error.message })
  }
})

router.post("/stop", async (req, res) => {
  try {
    await execPromise(stopTunnelCmd)
    logger.info("stop setted", stopTunnelCmd)
    res.json({ msg: "Success" })

  } catch (error) {
    console.log(error)
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    res.json({ error: error.message })
  }
})

router.post("/clear", async (req, res) => {
  try {
    try {
      const disable = `"${tunnelPath}" disable`
      await execPromise(disable)
      logger.info("disable setted", disable)
    } catch (error) {
      console.log(error)
      logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    }

    try {
      const homeDirectory = os.homedir()
      const tunnelFolder = path.join(homeDirectory, ".zrok")
      await fs.rm(tunnelFolder, { recursive: true })
      await writeJSON(configPath, {})
      logger.info("clear setted", configPath)
    } catch (error) {
      console.log("no file")
      logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    }

    res.json({ msg: "Success" })

  } catch (error) {
    console.log(error)
    logger.error(`${JSON.stringify(error)}, ${error?.message}`)
    res.status(500).json({ error: error.message })
  }
})

export default router
