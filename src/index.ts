import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import 'dotenv/config'
import auth from '@/routes/auth.routes.js'
import { log, customLoggerMethods, AppError } from '@/utils/logging.js' 
import { v4 as uuidv4 } from 'uuid';

const app = new Hono()

app.use('/api/*', async (c, next) => {
  const start = Date.now();
  const requestId = uuidv4();
  const { method, path } = c.req;

  log('Incoming request', { requestId, method, path });

  await next();
  const responseTime = Date.now() - start;
  const status = c.res.status;
  log('Request completed', { requestId, method, path, status, responseTime });
});


app.get('/api', (c) => {
  return c.json({
    message: 'Hello, World!',
    env: process.env.NODE_ENV || 'development'
  })
})


const api = new Hono()
api.route('/auth', auth)
app.route('/api', api)


app.onError((err, c) => {
  const status = (err as any).status || 500
  const message = err.message || 'Internal Server Error'
  const details = (err as any).details || undefined

  customLoggerMethods.error('Application error', {
    error: message,
    status,
    stack: err.stack,
    details
  })

  return c.json(
    {
      message,
      success: false,
      ...(details && { details })
    },
    status
  )
})

app.notFound((c) => {
  return c.json({ message: 'route not found' }, 404)
})


serve({
  fetch: app.fetch,
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
}, (info) => {
  console.log(`✅ Server is running on http://localhost:${info.port}`)
})
