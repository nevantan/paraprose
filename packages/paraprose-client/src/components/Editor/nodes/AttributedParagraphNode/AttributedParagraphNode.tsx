// Libraries
import { $applyNodeReplacement, ParagraphNode, type NodeKey } from 'lexical'
import { v4 as uuid } from 'uuid'

type ParagraphSource = 'user' | 'llm'

export class AttributedParagraphNode extends ParagraphNode {
  private _uuid = uuid()
  private _source: ParagraphSource = 'user'
  private _persisted: boolean = false

  constructor(
    _uuid = uuid(),
    source: ParagraphSource = 'user',
    persisted: boolean = false,
    key?: NodeKey
  ) {
    super(key)
    this._uuid = _uuid
    this._source = source
    this._persisted = persisted
  }

  static getType(): string {
    return 'attributed-paragraph'
  }

  static clone(node: AttributedParagraphNode): AttributedParagraphNode {
    return new AttributedParagraphNode(
      node.uuid,
      node.source,
      node.persisted,
      node.__key
    )
  }

  createDOM(): HTMLElement {
    const dom = document.createElement('p')
    dom.id = this._uuid
    return dom
  }

  updateDom(): boolean {
    return false
  }

  public setPersisted(persisted: boolean) {
    const self = this.getWritable()
    self._persisted = persisted
    return self
  }

  public setUUID(uuid: string) {
    const self = this.getWritable()
    self._uuid = uuid
    return self
  }

  get uuid() {
    return this._uuid
  }

  get source() {
    return this._source
  }

  get persisted() {
    return this._persisted
  }
}

export function $createAttributedParagraph(
  uuid?: string,
  source?: ParagraphSource,
  persisted?: boolean
): AttributedParagraphNode {
  return $applyNodeReplacement(
    new AttributedParagraphNode(uuid, source, persisted)
  )
}

export function $markParagraphAsPersisted(
  node: AttributedParagraphNode
): AttributedParagraphNode {
  return node.setPersisted(true)
}

export function $setUUIDFromServer(
  node: AttributedParagraphNode,
  uuid: string
) {
  return node.setUUID(uuid)
}
