import { EditorConfig, LexicalNode, NodeKey, SerializedLexicalNode, Spread, } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey, DecoratorNode, } from 'lexical';
import { useRef } from 'react';
import MathField from '../ui/MathField';

import "./MathNode.css";
import { MathfieldElement } from 'mathlive';

type MathComponentProps = { value: string; nodeKey: NodeKey; };

function MathComponent({ value, nodeKey, }: MathComponentProps): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const mathfieldRef = useRef<MathfieldElement>(null);

  const handleInput = (value: string) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isMathNode(node)) {
        node.setValue(value);
      }
    });
  };

  return <MathField value={value} onInput={handleInput} mathfieldRef={mathfieldRef} />
}

export type SerializedMathNode = Spread<{ type: 'math'; value: string; }, SerializedLexicalNode>;

export class MathNode extends DecoratorNode<JSX.Element> {
  __value: string;

  static getType(): string {
    return 'math';
  }

  static clone(node: MathNode): MathNode {
    return new MathNode(node.__value, node.__inline, node.__key);
  }

  constructor(value: string, inline?: boolean, key?: NodeKey) {
    super(key);
    this.__value = value;
  }

  static importJSON(serializedNode: SerializedMathNode): MathNode {
    const node = $createMathNode(
      serializedNode.value,
    );
    return node;
  }

  exportJSON(): SerializedMathNode {
    return {
      value: this.getValue(),
      type: 'math',
      version: 1,
    };
  }

  createDOM(_config: EditorConfig): HTMLElement {
    return document.createElement('span');
  }

  updateDOM(prevNode: MathNode): boolean {
    return false;
  }

  getValue(): string {
    return this.__value;
  }

  setValue(value: string): void {
    const writable = this.getWritable();
    writable.__value = value;
  }

  decorate(): JSX.Element {
    return <MathComponent value={this.__value} nodeKey={this.__key} />
  }
}

export function $createMathNode(value = ''): MathNode {
  const mathNode = new MathNode(value);
  return mathNode;
}

export function $isMathNode(node: LexicalNode | null | undefined): node is MathNode {
  return node instanceof MathNode;
}