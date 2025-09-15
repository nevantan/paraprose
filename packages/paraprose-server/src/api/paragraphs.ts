// Libraies
import { Hono } from 'hono'

// Database
import { chaptersTable, paragraphsTable, storiesTable } from '../db/schema/core'

// Types
import type { Context } from '../'
import { and, eq } from 'drizzle-orm'
import { zValidator } from '@hono/zod-validator'
import z from 'zod'

const paragraphRouter = new Hono<{ Variables: Context }>()
  .get('/', async (c) => {
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
  })
  .patch(
    '/:paragraphId',
    zValidator(
      'json',
      z.object({
        content: z.string().min(1),
      })
    ),
    async (c) => {
      const db = c.get('db')
      const session = c.get('session')
      const { paragraphId } = c.req.param()
      const { content } = await c.req.valid('json')

      const [paragraph] = await db
        .select()
        .from(paragraphsTable)
        .leftJoin(
          chaptersTable,
          eq(paragraphsTable.chapterId, chaptersTable.id)
        )
        .leftJoin(storiesTable, eq(chaptersTable.storyId, storiesTable.id))
        .where(
          and(
            eq(storiesTable.userId, session.user.id),
            eq(paragraphsTable.id, paragraphId)
          )
        )

      if (!paragraph) return c.json({ message: 'Unauthorized' }, 401)

      const paragraphs = await db
        .update(paragraphsTable)
        .set({ content })
        .where(eq(paragraphsTable.id, paragraphId))
        .returning()

      if (paragraphs.length === 0) {
        return c.json({ message: 'Paragraph not found' }, 404)
      }

      return c.json(paragraphs[0])
    }
  )

export default paragraphRouter
