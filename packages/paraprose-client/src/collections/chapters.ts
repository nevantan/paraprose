import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { createCollection } from '@tanstack/react-db'
import { client, queryClient } from '@/lib/api'

export const chaptersCollection = createCollection(
  queryCollectionOptions({
    queryKey: ['chapters'],
    queryFn: async () => {
      const res = await client.chapters.$get()

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
        if (!insert.storyId) continue

        await client.stories[':id'].chapters.$post({
          param: { id: insert.storyId },
          json: { title: insert.title, position: insert.position },
        })
      }
    },
    onUpdate: async () => {
      // const updates = transaction.mutations.map((m) => ({
      //   id: m.key,
      //   changes: m.changes,
      // }))
      // await client.stories.$patch({ json: { updates } })
    },
  })
)
