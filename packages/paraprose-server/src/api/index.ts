// Libraries
import { Hono } from 'hono'
import { protect } from '../lib/auth'
import { db } from '../db'

// Routes
import storyRouter from './stories'

// Types
import { Context } from '..'
import chapterRouter from './chapters'

const apiRouter = new Hono<{ Variables: Context }>()
  .route('/stories', storyRouter)
  .route('/chapters', chapterRouter)

export default apiRouter
