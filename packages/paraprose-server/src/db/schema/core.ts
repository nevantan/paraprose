import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { userTable } from './auth'

export const storiesTable = pgTable('stories', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const tagsTable = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  value: text('value').notNull(),
})

export const storyTagsTable = pgTable(
  'story_tags',
  {
    storyId: uuid('story_id')
      .notNull()
      .references(() => storiesTable.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tagsTable.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.storyId, table.tagId] })]
)

export const chaptersTable = pgTable('chapters', {
  id: uuid('id').primaryKey().defaultRandom(),
  storyId: uuid('story_id')
    .notNull()
    .references(() => storiesTable.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  position: integer('position').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const paragraphSourceEnum = pgEnum('paragraph_source', ['user', 'llm'])

export const paragraphsTable = pgTable('paragraphs', {
  id: uuid('id').primaryKey().defaultRandom(),
  chapterId: uuid('chapter_id')
    .notNull()
    .references(() => chaptersTable.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  position: integer('position').notNull(),
  source: paragraphSourceEnum('source').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
