// Libraies
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

// Database
import {
  chaptersTable,
  storiesTable,
  storyTagsTable,
  tagsTable,
} from '../db/schema/core'

// Types
import type { Context } from '../'
import { and, eq, sql } from 'drizzle-orm'

type StoryWithTags = typeof storiesTable.$inferSelect & {
  tags: string[]
  chapterCount: number
  wordCount: number
}

const storyRouter = new Hono<{ Variables: Context }>()
  .get('/', async (c) => {
    const db = c.get('db')
    const session = c.get('session')

    const chapterCounts = db
      .select({
        storyId: chaptersTable.storyId,
        chapterCount: sql<number>`count(*)`.as('chapter_count'),
      })
      .from(chaptersTable)
      .groupBy(chaptersTable.storyId)
      .as('chapter_counts')

    const storiesWithTags = await db
      .select({
        story: storiesTable,
        tag: tagsTable,
        chapterCount: chapterCounts.chapterCount,
      })
      .from(storiesTable)
      .leftJoin(chapterCounts, eq(storiesTable.id, chapterCounts.storyId))
      .leftJoin(storyTagsTable, eq(storiesTable.id, storyTagsTable.storyId))
      .leftJoin(tagsTable, eq(storyTagsTable.tagId, tagsTable.id))
      .where(eq(storiesTable.userId, session.user.id))

    const formattedStories: StoryWithTags[] = storiesWithTags.reduce<
      StoryWithTags[]
    >((stories, { story, tag, chapterCount }) => {
      const existingStory = stories.find((s) => s.id === story.id)
      if (existingStory && tag) {
        existingStory.tags.push(tag.value)
      } else {
        stories.push({
          ...story,
          tags: tag ? [tag.value] : [],
          chapterCount,
          wordCount: 0,
        })
      }
      return stories
    }, [])

    return c.json(formattedStories)
  })
  .post(
    '/',
    zValidator(
      'json',
      z.object({
        title: z.string().min(1).max(255),
      })
    ),
    async (c) => {
      const db = c.get('db')
      const session = c.get('session')
      const { title } = c.req.valid('json')

      const [newStory] = await db
        .insert(storiesTable)
        .values({ title, userId: session.user.id })
        .returning()

      return c.json(newStory)
    }
  )
  .patch(
    '/:id',
    zValidator(
      'json',
      z.object({
        title: z.string().min(1).max(255).optional(),
        description: z.string().max(1000).optional(),
      })
    ),
    async (c) => {
      const db = c.get('db')
      const session = c.get('session')
      const storyId = c.req.param('id')
      const updates = c.req.valid('json')

      const [updatedStory] = await db
        .update(storiesTable)
        .set(updates)
        .where(
          and(
            eq(storiesTable.id, storyId),
            eq(storiesTable.userId, session.user.id)
          )
        )
        .returning()

      if (!updatedStory) return c.json({ message: 'Unauthorized' }, 401)

      return c.json(updatedStory)
    }
  )
  .get('/:id/chapters', async (c) => {
    const db = c.get('db')
    const session = c.get('session')
    const storyId = c.req.param('id')

    const chapters = await db
      .select({
        chapter: chaptersTable,
      })
      .from(chaptersTable)
      .leftJoin(storiesTable, eq(chaptersTable.storyId, storiesTable.id))
      .where(
        and(
          eq(chaptersTable.storyId, storyId),
          eq(storiesTable.userId, session.user.id)
        )
      )

    return c.json(chapters.map(({ chapter }) => chapter))
  })
  .post(
    '/:id/chapters',
    zValidator(
      'json',
      z.object({
        title: z.string().min(1).max(255).optional(),
        position: z.number().min(0).optional(),
      })
    ),
    async (c) => {
      const db = c.get('db')
      const session = c.get('session')
      const storyId = c.req.param('id')
      const { title, position } = c.req.valid('json')

      const story = await db
        .select()
        .from(storiesTable)
        .where(
          and(
            eq(storiesTable.id, storyId),
            eq(storiesTable.userId, session.user.id)
          )
        )
        .limit(1)
        .then((res) => res[0])

      if (!story) return c.json({ message: 'Unauthorized' }, 401)

      const newChapter = await db
        .insert(chaptersTable)
        .values({
          title: title ?? 'New Chapter',
          position: position ?? 0,
          storyId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning()

      return c.json(newChapter)
    }
  )

export default storyRouter
