// Libraries
import React, { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getRoot } from 'lexical'

export const SentenceSplitterPlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    const unregister = editor.registerUpdateListener(({ editorState }) => {
      editor.update(() => {
        const root = $getRoot()

        const textNodes = root.getAllTextNodes()
      })
    })

    return () => {
      unregister()
    }
  }, [editor])

  return null
}
