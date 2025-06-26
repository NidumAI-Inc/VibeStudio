import { Router, Request, Response } from 'express';
import { pipeline } from 'stream/promises';
import axios from 'axios';
import path from 'path';
import fs from 'fs';

import { createPath } from '../utils/path-helper';

const router = Router()

router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const fileUrl = req.query.url as string

    if (!fileUrl) {
      return res.status(400).json({ error: 'Url query parameter is required' })
    }

    const filePath = createPath(["downloads", fileUrl.split('/').pop()])
    const directory = path.dirname(filePath)

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true })
    }

    const headResponse = await axios.head(fileUrl)
    const totalSize = parseInt(headResponse.headers['content-length'] || '0', 10)

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const response = await axios({
      method: 'GET',
      url: fileUrl,
      responseType: 'stream',
    })

    const writer = fs.createWriteStream(filePath)

    let downloadedSize = 0

    response.data.on('data', (chunk: Buffer) => {
      downloadedSize += chunk.length

      const progress = totalSize ? Math.round((downloadedSize / totalSize) * 100) : 0

      res.write(`data: ${JSON.stringify({
        progress,
        downloaded: downloadedSize,
        total: totalSize,
        status: 'downloading'
      })}\n\n`)
    })

    await pipeline(response.data, writer)

    res.write(`data: ${JSON.stringify({
      progress: 100,
      downloaded: downloadedSize,
      total: totalSize,
      status: 'completed',
      path: filePath
    })}\n\n`)

    res.end()

  } catch (error) {
    console.error('Download error:', error)

    if (!res.headersSent) {
      res.status(500).json({ error: 'Download failed' })
    } else {
      res.write(`data: ${JSON.stringify({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      })}\n\n`)
      res.end()
    }
  }
})

export default router
