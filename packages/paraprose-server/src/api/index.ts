// Libraries
import { Hono } from 'hono'

// Routes
import storyRouter from './stories'
import chapterRouter from './chapters'
import paragraphRouter from './paragraphs'
import completionRoute from './completions'

// Types
import { Context } from '..'

const apiRouter = new Hono<{ Variables: Context }>()
  .route('/stories', storyRouter)
  .route('/chapters', chapterRouter)
  .route('/paragraphs', paragraphRouter)
  .route('/completions', completionRoute)

export default apiRouter
