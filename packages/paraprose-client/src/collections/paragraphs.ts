import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { createCollection } from '@tanstack/react-db'
import { client, queryClient } from '@/lib/api'

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
      const inserts = transaction.mutations.map((m) => m.changes)
      for (const insert of inserts) {
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
