import { Schema } from "prosemirror-model";
import { keymap } from "prosemirror-keymap"
import Editor from "../";
import Extension from "./Extension";
import Mark from "../marks/Mark";
import Node from "../nodes/Node";

export default class ExtensionManager {
  extensions: Extension[];

  constructor(extensions: Extension[] = [], editor?: Editor) {
    if (editor) {
      extensions.forEach(extension => {
        extension.bindEditor(editor);
      });
    }

    this.extensions = extensions;
  }

  get nodes() {
    return this.extensions
      .filter(extension => extension.type === "node")
      .reduce(
        (nodes, node: Node) => ({
          ...nodes,
          [node.name]: node.schema,
        }),
        {}
      );
  }

  get marks() {
    return this.extensions
      .filter(extension => extension.type === "mark")
      .reduce(
        (marks, { name, schema }: Mark) => ({
          ...marks,
          [name]: schema,
        }),
        {}
      );
  }

  get plugins() {
    return this.extensions
      .filter(extension => extension.plugins)
      .reduce((allPlugins, { plugins }) => [...allPlugins, ...plugins], []);
  }

  keymaps({ schema }: { schema: Schema }) {
    const extensionKeymaps = this.extensions
      .filter(extension => ["extension"].includes(extension.type))
      .filter(extension => extension.keys)
      .map(extension => extension.keys({ schema }));

    const nodeMarkKeymaps = this.extensions
      .filter(extension => ["node", "mark"].includes(extension.type))
      .filter(extension => extension.keys)
      .map(extension =>
        extension.keys({
          type: schema[`${extension.type}s`][extension.name],
          schema,
        })
      );

    return [
      ...nodeMarkKeymaps,
      ...extensionKeymaps,
    ].map((keys: Record<string, any>) => keymap(keys));
  }

  inputRules({ schema }: { schema: Schema }) {
    const extensionInputRules = this.extensions
      .filter(extension => ["extension"].includes(extension.type))
      .filter(extension => extension.inputRules)
      .map(extension => extension.inputRules({ schema }));

    const nodeMarkInputRules = this.extensions
      .filter(extension => ["node", "mark"].includes(extension.type))
      .filter(extension => extension.inputRules)
      .map(extension =>
        extension.inputRules({
          type: schema[`${extension.type}s`][extension.name],
          schema,
        })
      );

    return [...extensionInputRules, ...nodeMarkInputRules].reduce(
      (allInputRules, inputRules) => [...allInputRules, ...inputRules],
      []
    );
  }
}
