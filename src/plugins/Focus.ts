import Extension from "../lib/Extension";
import { Plugin, PluginKey } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

export default class Focus extends Extension {
  get name() {
    return "focus";
  }

  get plugins() {
    const plugin = new PluginKey(this.name);
    
    return [
      new Plugin({
        key: plugin,
        state: {
          init() {
            return false;
          },
          apply(transaction, prevFocused) {
            let focused = transaction.getMeta(plugin);
            if (typeof focused === 'boolean') {
              return focused;
            }
            return prevFocused;
          }
        },
        props: {
          handleDOMEvents: {
            focus: (view: EditorView, event: MouseEvent) => {
              console.log("focus::focus")
              const { state } = view;
              const transaction = state.tr.setMeta('focused', true)
              view.dispatch(transaction)

              return true;
            },
            blur: (view: EditorView, event: MouseEvent) => {
              console.log("focus::blur")

              const { state } = view;
              const transaction = state.tr.setMeta('focused', false)
              view.dispatch(transaction)
              return true;
            }
          },
        },
      }),
    ]
  }
}
