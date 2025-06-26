import express from 'express'
import ttsRouter from '../controllers/tts'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(
  cors({
    origin: '*',
  })
)

app.use('/api/tts', ttsRouter)

app.get('/', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

export default app
