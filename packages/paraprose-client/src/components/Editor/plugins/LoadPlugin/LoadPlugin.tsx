// Libraries
import React, { useEffect, useRef } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createTextNode, $getRoot } from 'lexical'
import { $createAttributedParagraph } from '../../nodes/AttributedParagraphNode'
import { paragraphsCollection } from '@/collections/paragraphs'
import { eq, useLiveQuery } from '@tanstack/react-db'

interface LoadPluginProps {
  chapterId: string
}

export const LoadPlugin: React.FC<LoadPluginProps> = ({ chapterId }) => {
  const [editor] = useLexicalComposerContext()
  const loaded = useRef(false)

  const { data: paragraphs, isLoading } = useLiveQuery((q) =>
    q
      .from({ paragraph: paragraphsCollection })
      .where(({ paragraph }) => eq(paragraph.chapterId, chapterId))
      .orderBy(({ paragraph }) => paragraph.position, 'asc')
  )

  useEffect(() => {
    if (loaded.current || isLoading) return
    loaded.current = true

    console.log('Loading paragraphs for chapter', chapterId, paragraphs)
    return editor.update(() => {
      const root = $getRoot()

      for (const paragraph of paragraphs) {
        const paragraphNode = $createAttributedParagraph(
          paragraph.id,
          paragraph.source
        )

        const textNode = $createTextNode(paragraph.content)
        paragraphNode.append(textNode)
        console.log('appended text node', textNode, 'to', paragraphNode)

        root.append(paragraphNode)
      }
    })
  }, [editor, paragraphs])

  return null
}
