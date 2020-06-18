import * as React from "react";
import styled, { ThemeProvider } from "styled-components";
import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { gapCursor } from "prosemirror-gapcursor";
import { inputRules, InputRule } from "prosemirror-inputrules";
import { Schema, DOMParser, NodeSpec, MarkSpec } from "prosemirror-model";
import { keymap } from "prosemirror-keymap"
import { baseKeymap } from "prosemirror-commands";
import ExtensionManager from "./lib/ExtensionManager";
import { lightTheme, darkTheme } from "./theme";
import { Toolbar } from "./components/Toolbar";
import { FloatingToolbar } from "./components/FloatingToolbar";

// marks
import {
  Bold,
  Italic,
  Link,
  Strikethrough,
} from "./marks";

// nodes
import {
  Doc,
  BulletList,
  Heading,
  ListItem,
  OrderedList,
  Paragraph,
  Text,
} from "./nodes";

// plugins
import {
  Focus,
  History,
  Placeholder,
  SmartText,
  TrailingNode,
} from "./plugins";

export type Props = {
  /** Read-only editor instance */
  readOnly?: boolean;
  /** Placeholder when editor has no content */
  placeholder?: string;
  /** Initial editor content */
  initialValue?: string | {[key: string]: any};
  /** Callback fired on content change */
  onChange: (value: any) => void;
  /** Handler for clicking links in content */
  onClickLink: (href: string) => void;
  /** Callback when focusing editor */
  onFocus?: () => void;
  /** Callback when blurring editor */
  onBlur?: () => void;
  /** Color theme */
  theme?: typeof lightTheme;
}

class Editor extends React.PureComponent<Props> { 
  static defaultProps = {
    onClickLink: href => {
      window.open(href, "_blank");
    },
    theme: lightTheme,
  }

  extensions: ExtensionManager;
  keymaps: Plugin[];
  inputRules: InputRule[];
  pasteRules: any[];
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
    this.pasteRules = this.createPasteRules();
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
        new Heading(),
        new Text(),
        
        // marks
        new Bold(),
        new Italic(),
        new Link({
          onClickLink: this.props.onClickLink,
        }),
        new Strikethrough(),

        // plugins
        new Focus({
          onFocus: this.props.onFocus,
          onBlur: this.props.onBlur,
        }),
        new History(),
        new Placeholder({
          placeholder: this.props.placeholder,
        }),
        new SmartText(),
        new TrailingNode(),
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

  createPasteRules() {
    return this.extensions.pasteRules({
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
    const doc = this.createDocument(this.props.initialValue);

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
        ...this.pasteRules,
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
    const theme = this.props.theme;
    const toolbarReady = !readOnly && !!this.view;

    return (
      <ThemeProvider theme={theme || lightTheme}>
        <EditorWrapper>
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
        </EditorWrapper>
      </ThemeProvider>
    )
  }
}

const EditorWrapper = styled.div`
  background: ${props => props.theme.backgroundColor};
  color: ${props => props.theme.textColor};

`;

const StyledEditor = styled.div<{ readOnly?: boolean }>`
  color: ${props => props.theme.textColor};
  background: ${props => props.theme.backgroundColor};
  font-family: ${props => props.theme.fontFamily};
  position: relative;
  font-size: 1em;
  line-height: 1.7em;
  text-align: left;

  ${props => props.readOnly && `
    a:hover {
      &:after {
        background: blue;
        display: inline;
        opacity: .06;
      }
    }
  `}

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
      display: none;
      border-radius: 5px;
    }
  }

  .placeholder {
    &:before {
      display: block;
      content: ${props => (props.readOnly ? "" : "attr(data-empty-text)")};
      pointer-events: none;
      height: 0;
      color: #CCCCCC;
    }
  }
`

export default Editor;