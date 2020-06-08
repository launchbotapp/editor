import { toggleMark } from "prosemirror-commands";
import markInputRule from "../lib/markInputRule";
import Mark from "./Mark";

export default class Bold extends Mark {
  get name() {
    return "strong";
  }

  get schema() {
    return {
      parseDOM: [
        { tag: "b" },
        { tag: "strong" },
        { style: "font-style", getAttrs: value => value === "bold" },
      ],
      toDOM: () => ["strong"]
    }
  }

  keys({ type }) {
    return {
      "Mod-b": toggleMark(type),
      "Mod-B": toggleMark(type),
    };
  }

  inputRules({ type }) {
    return [markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, type)];
  }
}