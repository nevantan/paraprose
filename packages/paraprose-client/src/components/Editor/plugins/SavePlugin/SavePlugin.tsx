// Libraries
import React, { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useMutation } from '@tanstack/react-query'

interface SavePluginProps {}

export const SavePlugin: React.FC<SavePluginProps> = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      console.log(editorState)
    })
  }, [editor])

  return null
}
