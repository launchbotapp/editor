import {
  BoldIcon,
  ItalicIcon,
} from "outline-icons";
import { isInTable } from "prosemirror-tables";
import { EditorState } from "prosemirror-state";
import isInList from "../../queries/isInList";
import isMarkActive from "../../queries/isMarkActive";
import { MenuItem } from "./Menu";

export default function formattingMenuItems(state: EditorState): MenuItem[] {
  const { schema } = state;
  const isTable = isInTable(state);
  const isList = isInList(state);

  return [
    {
      name: "strong",
      label: "Bold",
      icon: BoldIcon,
      active: isMarkActive(schema.marks.strong),
    },
    {
      name: "em",
      label: "Italic",
      icon: ItalicIcon,
      active: isMarkActive(schema.marks.em),
    }
  ];
}
