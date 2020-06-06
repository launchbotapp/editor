import * as React from "react";
import styled from "styled-components";
import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { gapCursor } from "prosemirror-gapcursor";
import { inputRules, InputRule } from "prosemirror-inputrules";
import { Schema, DOMParser, NodeSpec, MarkSpec } from "prosemirror-model";
import { keymap } from "prosemirror-keymap"
import { baseKeymap } from "prosemirror-commands";
import ExtensionManager from "./lib/ExtensionManager";
import { Toolbar } from "./components/Toolbar";
import { FloatingToolbar } from "./components/FloatingToolbar";

// marks
import {
  Bold,
  Italic,
  Link,
} from "./marks";

// nodes
import {
  Doc,
  BulletList,
  ListItem,
  OrderedList,
  Paragraph,
  Text,
} from "./nodes";

// plugins
import {
  Focus,
  History,
  SmartText,
} from "./plugins";

export type Props = {
  id?: string;
  readOnly?: boolean;
  placeholder: string;
  defaultValue: any;
  onChange: (value: any) => void;
  onClickLink: (href: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

type State = {};

class Editor extends React.PureComponent<Props, State> { 
  static defaultProps = {
    defaultValue: "",
    onClickLink: href => {
      window.open(href, "_blank");
    },
  }

  extensions: ExtensionManager;
  keymaps: Plugin[];
  inputRules: InputRule[];
  nodes: { [name: string]: NodeSpec };
  marks: { [name: string]: MarkSpec };
  commands: Record<string, any>;
  element?: HTMLElement | null;
  schema: Schema;
  plugins: Plugin[];
  view: EditorView;
  
  componentDidMount() {
    this.init();
    
    // force re-render after init is complete
    this.forceUpdate();
  }

  componentDidUpdate(prevProps: Props) {
    // pass readOnly changes through to underlying editor instance
    if (prevProps.readOnly !== this.props.readOnly) {
      this.view.update({
        ...this.view.props,
        editable: () => !this.props.readOnly,
      });
    }
  }

  init() {
    this.extensions = this.createExtensions();
    this.nodes = this.createNodes();
    this.marks = this.createMarks();
    this.schema = this.createSchema();
    this.plugins = this.createPlugins();
    this.keymaps = this.createKeymaps();
    this.inputRules = this.createInputRules();
    this.view = this.createView();
    this.commands = this.createCommands();
  }

  createExtensions() {
    return new ExtensionManager(
      [
        new Doc(),
        // nodes
        new Paragraph(),
        new BulletList(),
        new OrderedList(),
        new ListItem(),
        new Text(),
        
        // marks
        new Bold(),
        new Italic(),
        new Link({
          onClickLink: this.props.onClickLink,
        }),

        // plugins
        new Focus({
          onFocus: this.props.onFocus,
          onBlur: this.props.onBlur,
        }),
        new History(),
        new SmartText(),
      ],
      this
    );
  }

  createCommands() {
    return this.extensions.commands({
      schema: this.schema,
      view: this.view,
    });
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

  createPlugins() {
    return this.extensions.plugins;
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
      editable: () => !this.props.readOnly,
      dispatchTransaction: transaction => {
        const { state, transactions } = this.view.state.applyTransaction(
          transaction
        );

        this.view.updateState(state);

        // If editor content changes, fire handleChange() so external components are aware
        if (transactions.some(tr => tr.docChanged)) {
          this.handleChange();
        }

        // Because Prosemirror and React are not linked we must tell React that
        // a render is needed whenever the Prosemirror state changes.
        this.forceUpdate();
      }
    });
    
    return view;
  }

  createState() {
    const doc = this.createDocument(this.props.defaultValue);

    return EditorState.create({
      schema: this.schema,
      doc: doc,
      plugins: [
        ...this.plugins,
        ...this.keymaps,
        gapCursor(),
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
    if (this.props.onChange && !this.props.readOnly) {
      this.props.onChange(this.value());
    }
  };

  render = () => {
    const { readOnly } = this.props;
    const toolbarReady = !readOnly && this.view;


    return (
      <React.Fragment>
        {toolbarReady && (
          <Toolbar
            view={this.view}
            commands={this.commands}
          />
        )}
        <StyledEditor
          ref={ref => (this.element = ref)}
          readOnly={readOnly}
        />

        {toolbarReady && (
          <FloatingToolbar
            view={this.view}
            commands={this.commands}
          />
        )}
      </React.Fragment>
    )
  }
}

const StyledEditor = styled.div<{ readOnly?: boolean }>`
  z-index: 1;
  position: relative;
  font-size: 1em;
  line-height: 1.7em;

  .ProseMirror {
    position: relative;
    outline: none;
    word-wrap: break-word;
    white-space: pre-wrap;
    white-space: break-spaces;
    background: transparent;
  }

  p {
    position: relative;
    margin: 0;
  }

  ul,
  ol {
    margin: 0 0.2em;
    padding: 0 0 0 2em;

    ul,
    ol {
      margin: 0;
    }
  }

  a {
    text-decoration: underline;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      top: -1px;
      bottom: -1px;;
      left: -2px;
      right: -2px;
      min-width: 0;
      opacity: 0;
      border-radius: 5px;
    }

    &:hover {
      &:after {
        background: blue;
        opacity: .06;
      }
    }
  }
`

export default Editor;