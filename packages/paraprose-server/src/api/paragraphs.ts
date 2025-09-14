// Libraies
import { Hono } from 'hono'

// Database
import { chaptersTable, paragraphsTable, storiesTable } from '../db/schema/core'

// Types
import type { Context } from '../'
import { eq } from 'drizzle-orm'

const paragraphRouter = new Hono<{ Variables: Context }>().get(
  '/',
  async (c) => {
    const db = c.get('db')
    const session = c.get('session')

    const paragraphs = await db
      .select({
        paragraph: paragraphsTable,
      })
      .from(paragraphsTable)
      .leftJoin(chaptersTable, eq(paragraphsTable.chapterId, chaptersTable.id))
      .leftJoin(storiesTable, eq(chaptersTable.storyId, storiesTable.id))
      .where(eq(storiesTable.userId, session.user.id))

    return c.json(paragraphs.map(({ paragraph }) => paragraph))
  }
)

export default paragraphRouter
