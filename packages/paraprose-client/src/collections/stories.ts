import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { createCollection } from '@tanstack/react-db'
import { client, queryClient } from '@/lib/api'

export const storiesCollection = createCollection(
  queryCollectionOptions({
    queryKey: ['stories'],
    queryFn: async () => {
      const res = await client.stories.$get()

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
    onInsert: async () => {
      await client.stories.$post({ json: { title: 'Untitled Story' } })
    },
    onUpdate: async ({ transaction }) => {
      const updates = transaction.mutations.map((m) => ({
        id: m.key,
        changes: m.changes,
      }))

      for (const update of updates) {
        await client.stories[':id'].$patch({
          param: { id: update.id },
          json: {
            title: update.changes.title,
            description: update.changes.description,
          },
        })
      }
    },
  })
)
