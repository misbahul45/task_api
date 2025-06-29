import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import 'dotenv/config'
import auth from './routes/auth.routes.js'

const app = new Hono()


app.get('/', (c) => {
  return c.json({
    message: 'Hello, World!',
    env: process.env.NODE_ENV || 'development'
  })
})
app.use('/auth', auth)


serve({
  fetch: app.fetch,
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
