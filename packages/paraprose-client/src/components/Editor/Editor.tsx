// Libraries
import React from 'react'

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { GeneratorPlugin } from './plugins/GeneratorPlugin'
import { SavePlugin } from './plugins/SavePlugin'
import {
  AttributedParagraphNode,
  $createAttributedParagraph,
} from './nodes/AttributedParagraphNode'
import { ParagraphNode } from 'lexical'

const theme = {}

const onError = (error: Error) => {
  console.error('Lexical error:', error)
}

export const Editor: React.FC = () => {
  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError,
    nodes: [
      AttributedParagraphNode,
      {
        replace: ParagraphNode,
        with: (_node: ParagraphNode) => {
          return $createAttributedParagraph()
        },
        withKlass: AttributedParagraphNode,
      },
    ],
  }

  return (
    <div className="flex flex-1 w-full relative">
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="flex-1 outline-0"
              aria-placeholder={'Enter some text...'}
              placeholder={
                <div className="absolute top-0 left-0 pointer-events-none text-steel">
                  Once upon a time...
                </div>
              }
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <GeneratorPlugin />
        <SavePlugin />
      </LexicalComposer>
    </div>
  )
}
