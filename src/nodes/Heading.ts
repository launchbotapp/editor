import { NodeType } from "prosemirror-model";
import { textblockTypeInputRule } from "prosemirror-inputrules";
import { setBlockType } from "prosemirror-commands";
import backspaceToParagraph from "../commands/backspaceToParagraph";
import toggleBlockType from "../commands/toggleBlockType";
import Node from "./Node";

export default class Heading extends Node {
  get name() {
    return "heading";
  }

  get defaultOptions() {
    return {
      levels: [1, 2, 3, 4],
    };
  }

  get schema() {
    return {
      attrs: {
        level: {
          default: 1,
        }
      },
      content: "inline*",
      group: "block",
      parseDOM: this.options.levels.map(level => ({
        tag: `h${level}`,
        attrs: { level },
      })),
      toDOM: node => [`h${node.attrs.level}`, 0],
    };
  }

  commands({ type, schema }) {
    return (attrs: Record<string, any>) => {
      return toggleBlockType(type, schema.nodes.paragraph, attrs);
    };
  }

  inputRules({ type }: { type: NodeType }) {
    return this.options.levels.map(level =>
      textblockTypeInputRule(new RegExp(`^(#{1,${level}})\\s$`), type, () => ({
        level,
      }))
    );
  }

  keys({ type }: { type: NodeType }) {
    const options = this.options.levels.reduce(
      (items, level) => ({
        ...items,
        ...{
          [`Alt-Mod-${level}`]: setBlockType(type, { level }),
        },
      }),
      {}
    );

    return {
      ...options,
      Backspace: backspaceToParagraph(type),
    };
  }
}