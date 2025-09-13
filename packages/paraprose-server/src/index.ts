// Libraries
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth, protect } from './lib/auth'

// Routes
import apiRouter from './api'
import { db } from './db'

export interface Context {
  db: typeof db
  session: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>
}

const app = new Hono<{ Variables: Context }>()
  .use(
    '*',
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    })
  )
  .on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw))
  .use(protect)
  .use(async (c, next) => {
    c.set('db', db)
    await next()
  })
  .route('/api', apiRouter)

export default app
export type AppType = typeof app
