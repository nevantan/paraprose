// Libraies
import { Hono } from 'hono'

// Database
import {
  chaptersTable,
  storiesTable,
  storyTagsTable,
  tagsTable,
} from '../db/schema/core'

// Types
import type { Context } from '../'
import { eq } from 'drizzle-orm'

const chapterRouter = new Hono<{ Variables: Context }>().get('/', async (c) => {
  const db = c.get('db')
  const session = c.get('session')

  const chapters = await db
    .select({
      chapter: chaptersTable,
    })
    .from(chaptersTable)
    .leftJoin(storiesTable, eq(chaptersTable.storyId, storiesTable.id))
    .where(eq(storiesTable.userId, session.user.id))

  return c.json(chapters.map(({ chapter }) => chapter))
})

export default chapterRouter
