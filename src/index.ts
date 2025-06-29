import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import 'dotenv/config'
import auth from '@/routes/auth.routes.js' // pastikan ekstensi sesuai konfigurasi tsconfig/module

const app = new Hono()

// Root route — bisa dihilangkan jika tidak dibutuhkan
app.get('/', (c) => {
  return c.json({
    message: 'Hello, World!',
    env: process.env.NODE_ENV || 'development'
  })
})

const api = new Hono()

api.route('/auth', auth)


app.route('/api', api)

serve({
  fetch: app.fetch,
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
}, (info) => {
  console.log(`✅ Server is running on http://localhost:${info.port}`)
})
