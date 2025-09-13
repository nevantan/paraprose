// Libraries
import React, { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { COMMAND_PRIORITY_CRITICAL, KEY_ENTER_COMMAND } from 'lexical'

interface GeneratorPluginProps {}

export const GeneratorPlugin: React.FC<GeneratorPluginProps> = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (e) => {
        if (e?.ctrlKey) {
          console.log('Do generate')
        } else {
          console.log('Just a regular enter')
        }

        return true
      },
      COMMAND_PRIORITY_CRITICAL
    )
  }, [editor])

  return null
}
