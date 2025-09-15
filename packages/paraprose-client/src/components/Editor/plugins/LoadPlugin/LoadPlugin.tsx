// Libraries
import React, { useEffect, useRef } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createTextNode, $getRoot } from 'lexical'
import { $createAttributedParagraph } from '../../nodes/AttributedParagraphNode'
import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/api'

interface LoadPluginProps {
  chapterId: string
}

export const LoadPlugin: React.FC<LoadPluginProps> = ({ chapterId }) => {
  const [editor] = useLexicalComposerContext()
  const loaded = useRef(false)

  const {
    data: paragraphs,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['paragraphs', chapterId],
    queryFn: async () => {
      const res = await client.chapters[':chapterId'].paragraphs.$get({
        param: { chapterId },
      })

      if (!res.ok) throw new Error(res.statusText)

      try {
        const data = await res.json()
        return data
      } catch {
        throw new Error('Failed to parse response')
      }
    },
  })

  useEffect(() => {
    if (loaded.current || isPending || isError) return
    loaded.current = true

    return editor.update(() => {
      const root = $getRoot()

      for (const paragraph of paragraphs) {
        const paragraphNode = $createAttributedParagraph(
          paragraph.id,
          paragraph.source,
          true
        )

        const textNode = $createTextNode(paragraph.content)
        paragraphNode.append(textNode)

        root.append(paragraphNode)
      }
    })
  }, [editor, paragraphs, isPending, isError])

  return null
}
