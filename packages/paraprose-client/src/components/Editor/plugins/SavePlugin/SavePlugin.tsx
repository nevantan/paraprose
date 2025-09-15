// Libraries
import React, { useCallback, useLayoutEffect, useRef } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getRoot } from 'lexical'
import {
  $markParagraphAsPersisted,
  $setUUIDFromServer,
  AttributedParagraphNode,
} from '../../nodes/AttributedParagraphNode'
import { useMutation } from '@tanstack/react-query'
import { client } from '@/lib/api'

interface SavePluginProps {
  chapterId: string
}

export const SavePlugin: React.FC<SavePluginProps> = ({ chapterId }) => {
  const [editor] = useLexicalComposerContext()

  const { mutateAsync: insertParagraph } = useMutation({
    mutationFn: async (paragraph: {
      content: string
      chapterId: string
      position: number
    }) => {
      const res = await client.chapters[':chapterId'].paragraphs.$post({
        param: { chapterId: paragraph.chapterId },
        json: {
          content: paragraph.content,
          position: paragraph.position,
        },
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

  const debounceTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map())
  const { mutateAsync: _updateParagraph } = useMutation({
    mutationFn: async (paragraph: { id: string; content: string }) => {
      const res = await client.paragraphs[':paragraphId'].$patch({
        param: { paragraphId: paragraph.id },
        json: { content: paragraph.content },
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
  const updateParagraph = useCallback(
    (paragraph: { id: string; content: string }) => {
      if (debounceTimeouts.current.has(paragraph.id)) {
        clearTimeout(debounceTimeouts.current.get(paragraph.id))
      }

      const timeout = setTimeout(() => {
        _updateParagraph(paragraph).catch((e) => {
          console.error('Failed to update paragraph', e)
        })
        debounceTimeouts.current.delete(paragraph.id)
      }, 500)

      debounceTimeouts.current.set(paragraph.id, timeout)
    },
    [_updateParagraph]
  )

  useLayoutEffect(() => {
    return editor.registerUpdateListener(
      async ({ dirtyElements, dirtyLeaves, editorState }) => {
        if (dirtyElements.size === 0 && dirtyLeaves.size === 0) {
          return
        }

        console.log(editorState, dirtyElements, dirtyLeaves)

        editor.read(() => {
          const root = $getRoot()
          const topLevel = root.getChildren()

          const paragraphNodes = topLevel.filter(
            (node) => node instanceof AttributedParagraphNode
          )

          for (const node of paragraphNodes) {
            if (node.getChildren().length === 0) continue

            if (node.persisted) {
              if (dirtyElements.has(node.getKey())) {
                updateParagraph({
                  id: node.uuid,
                  content: node.getTextContent(),
                })
              }
            } else {
              insertParagraph({
                // TODO: Update to maintain formatting
                content: node.getTextContent(),
                chapterId: chapterId,
                position: paragraphNodes.length,
              }).then(({ id }) => {
                editor.update(
                  () => {
                    $markParagraphAsPersisted(node)
                    $setUUIDFromServer(node, id)
                  },
                  { discrete: true }
                )
              })
            }
          }
        })
      }
    )
  }, [editor, insertParagraph, updateParagraph, chapterId])

  return null
}
