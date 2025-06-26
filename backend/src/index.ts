import { createNodeWebSocket } from '@hono/node-ws';
import { createServer } from 'node:https';
import { serveStatic } from '@hono/node-server/serve-static';
import { requestId } from 'hono/request-id';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { Hono } from 'hono';
import fs from 'node:fs';
import 'dotenv/config';

import socketHandler from './socket/index.js';
import googleRoutes from './routes/google.js';
import usageRoutes from './routes/usage.js';
import fakerRoutes from './routes/faker.js';
import userRoutes from './routes/user.js';

import connectDB from './lib/connect-db.js';

const app = new Hono()
const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app })

app.use('/static/*', serveStatic({ root: "./" }))

app.use(logger())
app.use(cors())
app.use('*', requestId())

await connectDB()

app.use('*', async (c, next) => {
  const xForwardedFor = c.req.header('x-forwarded-for') || 'unknown';
  console.log(`x-forwarded-for: ${xForwardedFor}`);
  await next();
})

app.get("/api/health", c => c.json({ status: "ok" }))

app.route("/api/user", userRoutes)
app.route("/api/auth", googleRoutes)
app.route("/api/usage", usageRoutes)
app.route("/api/faker", fakerRoutes)

app.get('/api/ws', upgradeWebSocket(socketHandler))

app.notFound(c => c.json({ message: 'Route not found' }, 404))

app.onError((err, c) => {
  console.log(err)
  return c.json({ message: err.message || "Internal sever eror" }, 500)
})

const port = Number(process.env.PORT || 5000)
const isProduction = process.env.NODE_ENV === 'production'
let config = {}

if (isProduction) {
  config = {
    createServer,
    serverOptions: {
      key: fs.readFileSync('/etc/letsencrypt/live/link.nativenode.host/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/link.nativenode.host/fullchain.pem')
    },
  }
}

const server = serve({ fetch: app.fetch, port, ...config }, () => {
  console.log(`Server is running on the port: ${port}`)
})

injectWebSocket(server)
