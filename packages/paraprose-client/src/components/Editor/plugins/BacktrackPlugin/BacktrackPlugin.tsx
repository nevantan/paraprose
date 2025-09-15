// Libraries
import React, { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { COMMAND_PRIORITY_HIGH, KEY_TAB_COMMAND } from 'lexical'

export const BacktrackPlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    editor.registerCommand(
      KEY_TAB_COMMAND,
      (e) => {
        e.preventDefault()
        e.stopPropagation()

        console.log(e)

        return false
      },
      COMMAND_PRIORITY_HIGH
    )
  }, [editor])

  return null
}
