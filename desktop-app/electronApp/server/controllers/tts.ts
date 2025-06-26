import express from 'express'
import path from 'path'
import fs from 'fs'
import { checkIsDirExists, createPath, getRoot } from '../utils/path-helper.js'

import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/async-handler.js'

const router = express.Router()

type TTSModel = {
  generate: (text: string, options: { voice?: string; speed?: number }) => Promise<any>
  stream: (splitter: any) => AsyncGenerator<{ audio: any }, void, unknown>
}

let tts: TTSModel | null = null

async function loadModel(progressCallback: (progress: unknown) => void = () => {}): Promise<void> {
  try {
    const { env } = await import('@huggingface/transformers')
    env.cacheDir = getRoot()
    // console.log('📁 Using HuggingFace cache dir:', env.cacheDir)

    const { KokoroTTS } = await import('kokoro-js')
    const model = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', {
      dtype: 'q8',
      device: 'cpu',
      progress_callback: progressCallback,
    })

    if (model && typeof model.generate === 'function') {
      tts = model
      checkIsDirExists(createPath(['audio']))
      // console.log('✅ Kokoro TTS loaded!')
    } else {
      throw new Error('Model loaded but missing generate() method')
    }
  } catch (error: any) {
    console.error('❌ TTS model load failed:', error.stack || error.message || error)
    tts = null
  }
}

router.get(
  '/status',
  asyncHandler(async (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    await loadModel((progress) => {
      res.write(`data: ${JSON.stringify(progress)}\n\n`)
    })

    res.end()
  })
)

router.get(
  '/:filename',
  asyncHandler(async (req: Request, res: Response) => {
    const { filename } = req.params
    if (!filename) {
      res.status(400).send('Filename is required')
      return
    }

    const filePath = createPath(['audio', filename])
    res.sendFile(filePath, { dotfiles: 'allow' })
  })
)

router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { text, voice, speed } = req.body

    if (!text) {
      res.status(400).send('Text is required')
      return
    }

    if (!tts) {
      await loadModel()
      if (!tts) {
        res.status(500).send('TTS model failed to load')
        return
      }
    }

    const audio = await tts.generate(text, { voice, speed })
    const root = createPath(['audio'])
    const fileName = `temp_chunk_${Date.now()}.wav`
    const tempFile = path.join(root, fileName)

    await audio.save(tempFile)
    res.json({ fileName })
  })
)

router.post(
  '/stream',
  asyncHandler(async (req: Request, res: Response) => {
    const { text } = req.body

    if (!text) {
      res.status(400).send('Text is required')
      return
    }

    if (!tts) {
      await loadModel()
    }

    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Transfer-Encoding', 'chunked')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Cache-Control', 'no-cache')

    const { TextSplitterStream } = await import('kokoro-js')
    const splitter = new TextSplitterStream()

    const stream = tts!.stream(splitter)
    const tokens = text.match(/\s*\S+/g) || []
    const audioDir = createPath(['audio'])

    // Feed tokens
    ;(async () => {
      for (const token of tokens) {
        splitter.push(token)
        await new Promise((resolve) => setTimeout(resolve, 10))
      }
      splitter.close()
    })()

    for await (const { audio } of stream) {
      const fileName = `temp_chunk_${Date.now()}.wav`
      const filePath = path.join(audioDir, fileName)
      await audio.save(filePath)
      res.write(`data: ${fileName}\n\n`)

      if (res.socket && !res.socket.writable) {
        splitter.close()
        break
      }
    }

    res.end()
  })
)

router.delete(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { folderPath } = req.body

    if (!folderPath) {
      res.status(400).send('Folder path is required')
      return
    }

    const fullPath = createPath([folderPath])
    fs.rmSync(fullPath, { recursive: true, force: true })
    res.json({ message: 'Folder deleted successfully' })
  })
)

export default router
