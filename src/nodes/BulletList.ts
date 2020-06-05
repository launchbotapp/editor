import { wrappingInputRule } from "prosemirror-inputrules";
import toggleList from "../commands/toggleList";
import Node from "./Node";

export default class BulletList extends Node {
  get name() {
    return "bullet_list";
  }

  get schema() {
    return {
      content: "list_item+",
      group: "block",
      parseDOM: [{ tag: "ul" }],
      toDOM: () => ["ul", 0],
    };
  }

  keys({ type, schema }) {
    return {
      "Mod-Shift-7": toggleList(type, schema.nodes.list_item),
    };
  }

  commands({ type, schema}) {
    return () => toggleList(type, schema.nodes.list_item)
  }

  inputRules({ type }) {
    return [wrappingInputRule(/^\s*([-+*])\s$/, type)];
  }
}
