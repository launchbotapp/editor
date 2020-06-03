import * as React from 'react';
import styled from "styled-components";
import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { inputRules, InputRule } from "prosemirror-inputrules";
import { Schema, DOMParser, NodeSpec, MarkSpec } from "prosemirror-model";
import { undo, redo, history } from "prosemirror-history"
import { keymap } from "prosemirror-keymap"
import { baseKeymap } from "prosemirror-commands";
import ExtensionManager from "./lib/ExtensionManager";

// marks
import {
  Bold,
  Italic,
} from "./marks";

// nodes
import {
  Doc,
  BulletList,
  ListItem,
  Paragraph,
  Text,
} from "./nodes";

export type Props = {
  id?: string;
  placeholder: string;
  defaultValue: any;
  onChange?: (value: any) => void;
}

type State = {};

class Editor extends React.PureComponent<Props, State> {
  static defaultProps = {
    defaultValue: "",
  }

  extensions: ExtensionManager;
  keymaps: Plugin[];
  inputRules: InputRule[];
  nodes: { [name: string]: NodeSpec };
  marks: { [name: string]: MarkSpec };
  element?: HTMLElement | null;
  schema: Schema;
  view: EditorView;
  
  componentDidMount() {
    this.init();
  }

  init() {
    this.extensions = this.createExtensions();
    this.nodes = this.createNodes();
    this.marks = this.createMarks();
    this.schema = this.createSchema();
    this.keymaps = this.createKeymaps();
    this.inputRules = this.createInputRules();
    this.view = this.createView();
  }

  createExtensions() {
    return new ExtensionManager(
      [
        new Doc(),
        
        new Paragraph(),
        new BulletList(),
        new ListItem(),
        new Text(),
        
        new Bold(),
        new Italic(),
      ],
      this
    );
  }

  createNodes() {
    return this.extensions.nodes;
  }

  createMarks() {
    return this.extensions.marks;
  }

  createSchema() {
    return new Schema({
      nodes: this.nodes,
      marks: this.marks,
    })
  }

  createKeymaps() {
    return this.extensions.keymaps({
      schema: this.schema,
    });
  }

  createInputRules() {
    return this.extensions.inputRules({
      schema: this.schema,
    });
  }

  createView() {
    if (!this.element) {
      throw new Error("createView called before ref available");
    }

    const view = new EditorView(this.element, {
      state: this.createState(),
      dispatchTransaction: transaction => {
        const { state, transactions } = this.view.state.applyTransaction(
          transaction
        );

        this.view.updateState(state);

        if (transactions.some(tr => tr.docChanged)) {
          this.handleChange();
        }
      }
    });
    
    return view;
  }

  createState(value?: any) {
    const doc = this.createDocument(this.props.defaultValue);

    return EditorState.create({
      schema: this.schema,
      doc: doc,
      plugins: [
        history(),
        ...this.keymaps,
        keymap({
          "Mod-z": undo,
          "Mod-y": redo,
        }),
        inputRules({
          rules: this.inputRules,
        }),
        keymap(baseKeymap),
      ]
    })
  }

  createDocument(content: any) {
    if (content === null) {
      return this.schema.nodeFromJSON({
        type: 'doc',
        content: [{
          type: 'paragraph',
        }],
      });
    }

    if (typeof content === 'object') {
      try {
        return this.schema.nodeFromJSON(content)
      } catch (error) {
        console.warn('[editor warn]: Invalid content.', 'Passed value:', content, 'Error:', error)
        return this.schema.nodeFromJSON({
          type: 'doc',
          content: [{
            type: 'paragraph',
          }],
        });
      }
    }

    if (typeof content === 'string') {
      const element = document.createElement('div');
      element.innerHTML = content.trim();

      return DOMParser.fromSchema(this.schema).parse(element);
    }
  }

  value = () => {
    return this.view.state.toJSON().doc;
  }
  
  handleChange = () => {
    if (this.props.onChange) {
      this.props.onChange(this.value());
    }
  };

  render = () => {
    return (
      <React.Fragment>
        <StyledEditor
          ref={ref => (this.element = ref)}
        />
      </React.Fragment>
    )
  }
}

const StyledEditor = styled("div")`
  border: 1px solid #CCCCCC;
  font-size: 1em;
  line-height: 1.7em;
  width: 100%;
  padding: 1em;
  border-radius: 5px;

  .ProseMirror {
    position: relative;
    outline: none;
    word-wrap: break-word;
    white-space: pre-wrap;
    white-space: break-spaces;
  }

  p {
    position: relative;
    margin: 0;
  }

  ul,
  ol {
    margin: 0 0.1em;
    padding: 0 0 0 1em;

    ul,
    ol {
      margin: 0;
    }
  }
`


export default Editor;