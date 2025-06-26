import { Router, Request, Response } from 'express'
import path from 'path'
import fs from 'fs/promises'
import axios from 'axios'
import FormData from 'form-data'

interface FolderUploadRequest {
  rootPath: string
  destination: string
  folderName: string
  port: number
}

interface UploadResult {
  path: string
  size: number
}

const router = Router()

router.post<{}, {}, FolderUploadRequest>('/', async (req: Request<{}, {}, FolderUploadRequest>, res: Response) => {
  const { rootPath, destination, folderName, port } = req.body

  if (!rootPath || !destination || !folderName || !port) {
    res.status(400).json({ error: 'Missing parameters' })
    return
  }

  const uploadRoot = path.posix.join(destination, folderName)
  const entries: string[] = []

  async function walk(dir: string) {
    const list = await fs.readdir(dir, { withFileTypes: true })
    for (const ent of list) {
      const fullPath = path.join(dir, ent.name)
      entries.push(fullPath)
      if (ent.isDirectory()) await walk(fullPath)
    }
  }

  await walk(rootPath)

  const results: UploadResult[] = []

  await axios.post(`http://localhost:${port}/mkdir`, { path: uploadRoot })

  for (const entry of entries) {
    const stat = await fs.stat(entry)
    const rel = path.relative(rootPath, entry).replace(/\\/g, '/')
    const remotePath = path.posix.join(uploadRoot, rel)

    if (stat.isDirectory()) {
      await axios.post(`http://localhost:${port}/mkdir`, { path: remotePath })
    } else {
      const buffer = await fs.readFile(entry)
      const form = new FormData()
      form.append('file', buffer, path.basename(entry))

      await axios.post(`http://localhost:${port}/upload`, form, {
        params: { destination: path.posix.dirname(remotePath) },
        headers: form.getHeaders(),
      })

      results.push({ path: remotePath, size: buffer.length })
    }
  }

  res.json({ uploaded: results })
})

export default router
