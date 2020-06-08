import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import Extension from "../lib/Extension";

export default class Placeholder extends Extension {
  get name() {
    return "placeholder";
  }

  get defaultOptions() {
    return {
      emptyNodeClass: "placeholder",
      placeholder: "",
    }
  }

  get plugins() {
    return [
      new Plugin({
        props: {
          decorations: state => {
            const { doc } = state;
            const decorations: Decoration[] = [];
            const isEditorEmpty = doc.textContent.length === 0;

            /**
             * Only showing placeholder if doc is empty && positioned at 
             * start of the document
             */
            doc.descendants((node, pos) => {
              if (!isEditorEmpty) {
                return;
              }

              if (pos !== 0 || node.type.name !== "paragraph") {
                return;
              }

              const decoration = Decoration.node(pos, pos + node.nodeSize, {
                class: this.options.emptyNodeClass,
                "data-empty-text": this.options.placeholder,
              });

              decorations.push(decoration);
            });

            return DecorationSet.create(doc, decorations);
          }
        }
      })
    ]
  }
}