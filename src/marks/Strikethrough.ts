import { toggleMark } from "prosemirror-commands";
import markInputRule from "../lib/markInputRule";
import Mark from "./Mark";

export default class Strikethrough extends Mark {
  get name() {
    return "strikethrough";
  }

  get schema() {
    return {
      parseDOM: [
        { tag: "s" },
        { tag: "del" },
        { tag: "strike" },
      ],
      toDOM: () => ["del", 0],
    };
  }

  keys({ type }) {
    return {
      "Mod-d": toggleMark(type),
    };
  }

  inputRules({ type }) {
    return [markInputRule(/~([^~]+)~$/, type)];
  }
}
