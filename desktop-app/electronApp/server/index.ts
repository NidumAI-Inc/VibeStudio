import express from 'express'
import cors from 'cors'

import { checkPathsSetup } from './utils/path-helper'
import uploadFolder from './controllers/upload-folder'
import download from './controllers/download'
import general from './controllers/general'
import tunnel from './controllers/tunnel'
import ollama from './controllers/ollama'
import nodes from './controllers/nodes'
import frpc from './controllers/frpc'

checkPathsSetup()

const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/health', (_, res) => {
  res.json({ status: 'ok' })
})

app.use('/frpc', frpc)
app.use('/nodes', nodes)
app.use('/ollama', ollama)
app.use('/tunnel', tunnel)
app.use('/general', general)
app.use('/download', download)
app.use('/upload-folder', uploadFolder)

export default app
