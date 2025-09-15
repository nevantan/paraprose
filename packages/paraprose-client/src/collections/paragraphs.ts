import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { createCollection } from '@tanstack/react-db'
import { client, queryClient } from '@/lib/api'
import type { LexicalEditor } from 'lexical'
import {
  $markParagraphAsPersisted,
  AttributedParagraphNode,
} from '@/components/Editor/nodes/AttributedParagraphNode'

// Need to update to partial-fetch:
// https://tanstack.com/db/latest/docs/collections/query-collection#handling-partialincremental-fetches
export const paragraphsCollection = createCollection(
  queryCollectionOptions({
    queryKey: ['paragraphs'],
    queryFn: async () => {
      const res = await client.paragraphs.$get()

      if (!res.ok) throw new Error(res.statusText)

      try {
        const data = await res.json()

        return data
      } catch (e) {
        throw new Error('Failed to parse response')
      }
    },
    getKey: (item) => item.id,
    queryClient,
    onInsert: async ({ transaction }) => {
      for (const mutation of transaction.mutations) {
        const insert = mutation.changes

        if (
          !insert.chapterId ||
          !insert.content ||
          insert.position === undefined
        )
          continue

        console.log('Syncing insert to server', insert)
        await client.chapters[':chapterId'].paragraphs.$post({
          param: { chapterId: insert.chapterId },
          json: { content: insert.content, position: insert.position },
        })

        const metadata = mutation.metadata as {
          editor: LexicalEditor
          node: AttributedParagraphNode
        }

        metadata.editor.update(() => {
          $markParagraphAsPersisted(metadata.node)
        })
      }
    },
    onUpdate: async ({ transaction }) => {
      const updates = transaction.mutations.map((m) => m.changes)
      console.log('Syncing updates to server', updates)
      // const updates = transaction.mutations.map((m) => ({
      //   id: m.key,
      //   changes: m.changes,
      // }))
      // await client.stories.$patch({ json: { updates } })
    },
  })
)
