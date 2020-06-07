import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
} from "outline-icons";
import { EditorState } from "prosemirror-state";
import isMarkActive from "../../queries/isMarkActive";
import { MenuItem } from "./Menu";

export default function formattingMenuItems(state: EditorState): MenuItem[] {
  const { schema } = state;

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
    },
    {
      name: "strikethrough",
      label: "Strikethrough",
      icon: StrikethroughIcon,
      active: isMarkActive(schema.marks.strikethrough),
    },
  ];
}
