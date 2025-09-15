// Libraries
import React from 'react'

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import {
  LexicalComposer,
  type InitialConfigType,
} from '@lexical/react/LexicalComposer'
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
import { LoadPlugin } from './plugins/LoadPlugin'

const theme = {}

const onError = (error: Error) => {
  console.error('Lexical error:', error)
}

interface EditorProps {
  chapterId: string
}

export const Editor: React.FC<EditorProps> = ({ chapterId }) => {
  const initialConfig: InitialConfigType = {
    namespace: 'ParaProse',
    theme,
    onError,
    editorState: null,
    nodes: [
      AttributedParagraphNode,
      {
        replace: ParagraphNode,
        with: () => {
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
              className="flex flex-col gap-4 flex-1 outline-0"
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
        <SavePlugin chapterId={chapterId} />
        <LoadPlugin chapterId={chapterId} />
      </LexicalComposer>
    </div>
  )
}
