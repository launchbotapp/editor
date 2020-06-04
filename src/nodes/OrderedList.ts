import { wrappingInputRule } from "prosemirror-inputrules";
import toggleList from "../commands/toggleList";
import Node from "./Node";

export default class OrderedList extends Node {
  get name() {
    return "ordered_list";
  }

  get schema() {
    return {
      attrs: {
        order: {
          default: 1,
        },
      },
      content: "list_item+",
      group: "block",
      parseDOM: [
        {
          tag: "ol",
          getAttrs: (dom: HTMLElement) => ({
            order: dom.hasAttribute("start")
              ? parseInt(dom.getAttribute("start") || "1", 10)
              : 1,
          }),
        },
      ],
      toDOM: node =>
        node.attrs.order === 1
          ? ["ol", 0]
          : ["ol", { start: node.attrs.order }, 0],
    };
  }

  keys({ type, schema }) {
    return {
      "Mod-Shift-8": toggleList(type, schema.nodes.list_item),
    };
  }

  inputRules({ type }) {
    return [
      wrappingInputRule(
        /^(\d+)\.\s$/,
        type,
        match => ({ order: +match[1] }),
        (match, node) => node.childCount + node.attrs.order === +match[1]
      ),
    ];
  }
}
