// Libraries
import {
  $applyNodeReplacement,
  ParagraphNode,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalEditor,
  type NodeKey,
} from 'lexical'
import { v4 as uuid } from 'uuid'

type ParagraphSource = 'user' | 'llm'

export class AttributedParagraphNode extends ParagraphNode {
  private _uuid = uuid()
  private _source: ParagraphSource = 'user'

  constructor(_uuid = uuid(), source: ParagraphSource = 'user', key?: NodeKey) {
    super(key)
    this._uuid = _uuid
    this._source = source
  }

  static getType(): string {
    return 'attributed-paragraph'
  }

  static clone(node: AttributedParagraphNode): AttributedParagraphNode {
    return new AttributedParagraphNode(node.uuid, node.source, node.__key)
  }

  createDOM(): HTMLElement {
    const dom = document.createElement('p')
    dom.id = this._uuid
    return dom
  }

  updateDom(
    _prevNode: this,
    _dom: HTMLElement,
    _config: EditorConfig
  ): boolean {
    return false
  }

  get uuid() {
    return this._uuid
  }

  get source() {
    return this._source
  }
}

export function $createAttributedParagraph(
  uuid?: string,
  source?: ParagraphSource
): AttributedParagraphNode {
  return $applyNodeReplacement(new AttributedParagraphNode(uuid, source))
}
