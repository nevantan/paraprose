// Libraries
import React, { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getRoot } from 'lexical'
import { AttributedParagraphNode } from '../../nodes/AttributedParagraphNode'
import { paragraphsCollection } from '@/collections/paragraphs'
import { eq, useLiveQuery } from '@tanstack/react-db'

interface SavePluginProps {
  chapterId: string
}

export const SavePlugin: React.FC<SavePluginProps> = ({ chapterId }) => {
  const [editor] = useLexicalComposerContext()

  const { data: paragraphs } = useLiveQuery((q) =>
    q
      .from({ paragraph: paragraphsCollection })
      .where(({ paragraph }) => eq(paragraph.chapterId, chapterId))
  )

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      console.log(editorState)

      return editorState.read(() => {
        const root = $getRoot()
        const topLevel = root.getChildren()

        for (const node of topLevel) {
          if (node instanceof AttributedParagraphNode) {
            if (node.getChildren().length === 0) continue

            if (paragraphs.find((f) => f.id === node.uuid)) {
              paragraphsCollection.update(node.uuid, (draft) => {
                draft.content = node.getTextContent()
              })
            } else {
              paragraphsCollection.insert({
                id: node.uuid,
                // TODO: Update to maintain formatting
                content: node.getTextContent(),
                chapterId: chapterId,
                position: paragraphs.length,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                source: 'user',
              })
            }
          } else {
            console.log('Other', node)
          }
        }
      })
    })
  }, [editor, paragraphs])

  return null
}
