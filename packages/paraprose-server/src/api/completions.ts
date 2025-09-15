// Libraies
import { Hono } from 'hono'
import { and, eq } from 'drizzle-orm'
import { Eta } from 'eta'

// Database
import {
  chaptersTable,
  paragraphsTable,
  storiesTable,
  storyTagsTable,
  tagsTable,
} from '../db/schema/core'

// Types
import type { Context } from '..'

const completionRoute = new Hono<{ Variables: Context }>().post(
  '/:chapterId',
  async (c) => {
    const db = c.get('db')
    const session = c.get('session')
    const { chapterId } = c.req.param()

    // Fetch the chapter we want to generate completions for
    const [chapterRow] = await db
      .select({
        chapter: chaptersTable,
        story: storiesTable,
      })
      .from(chaptersTable)
      .innerJoin(storiesTable, eq(chaptersTable.storyId, storiesTable.id))
      .where(
        and(
          eq(storiesTable.userId, session.user.id),
          eq(chaptersTable.id, chapterId)
        )
      )

    if (!chapterRow) throw new Error('Not found')

    const { chapter, story } = chapterRow

    // Collect context: story tags
    const tags = story
      ? await db
          .select({
            id: tagsTable.id,
            userId: tagsTable.userId,
            value: tagsTable.value,
          })
          .from(storyTagsTable)
          .innerJoin(tagsTable, eq(storyTagsTable.tagId, tagsTable.id))
          .where(eq(storyTagsTable.storyId, story.id))
      : []

    // Collect context: preceeding paragraphs
    const paragraphs = await db
      .select({
        id: paragraphsTable.id,
        chapterId: paragraphsTable.chapterId,
        content: paragraphsTable.content,
        position: paragraphsTable.position,
        source: paragraphsTable.source,
        createdAt: paragraphsTable.createdAt,
        updatedAt: paragraphsTable.updatedAt,
      })
      .from(paragraphsTable)
      .where(eq(paragraphsTable.chapterId, chapter.id))
      .orderBy(paragraphsTable.position)

    const result = [{ ...chapter, story, tags, paragraphs }]
    console.log(result)

    // Load system prompt template
    const eta = new Eta({ views: `${process.cwd()}/src/templates` })
    console.log(
      eta.render('./continuation', {
        story_title: story.title,
        story_description: story.description,
        story_tags: tags.map((t) => t.value),
        recent_paragraphs: paragraphs.map((p) => p.content).slice(-3),
      })
    )
  }
)

export default completionRoute
