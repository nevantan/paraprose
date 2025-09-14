// Libraies
import { Hono } from 'hono'

// Database
import { chaptersTable, paragraphsTable, storiesTable } from '../db/schema/core'

// Types
import type { Context } from '../'
import { and, eq } from 'drizzle-orm'
import { zValidator } from '@hono/zod-validator'
import z from 'zod'

const chapterRouter = new Hono<{ Variables: Context }>()
  .get('/', async (c) => {
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
  .post(
    '/:chapterId/paragraphs',
    zValidator(
      'json',
      z.object({
        content: z.string().min(1),
        position: z.number().min(0),
      })
    ),
    async (c) => {
      const db = c.get('db')
      const session = c.get('session')
      const { chapterId } = c.req.param()
      const { content, position } = c.req.valid('json')

      const [chapter] = await db
        .select()
        .from(chaptersTable)
        .innerJoin(storiesTable, eq(chaptersTable.storyId, storiesTable.id))
        .where(
          and(
            eq(chaptersTable.id, chapterId),
            eq(storiesTable.userId, session.user.id)
          )
        )

      if (!chapter) return c.json({ message: 'Unauthorized' }, 401)

      const [newParagraph] = await db
        .insert(paragraphsTable)
        .values({ chapterId, content, position, source: 'user' })
        .returning()

      return c.json(newParagraph)
    }
  )

export default chapterRouter
