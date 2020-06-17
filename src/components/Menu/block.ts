import {
  BulletedListIcon,
  OrderedListIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
} from "outline-icons";
import { EditorState } from "prosemirror-state";
import isNodeActive from "../../queries/isNodeActive";
import { MenuItem } from "./Menu";

export default function blockMenuItems(state: EditorState): MenuItem[] {
  const { schema } = state;

  return [
    {
      name: "bullet_list",
      label: "Bullet List",
      icon: BulletedListIcon,
      active: isNodeActive(schema.nodes.bullet_list),
    },
    {
      name: "ordered_list",
      label: "Ordered List",
      icon: OrderedListIcon,
      active: isNodeActive(schema.nodes.ordered_list),
    },
    {
      name: "separator",
    },
    {
      name: "heading",
      label: "Big heading",
      icon: Heading1Icon,
      attrs: { level: 1 },
      active: isNodeActive(schema.nodes.heading, { level: 1 }),
    },
    {
      name: "heading",
      label: "Medium heading",
      icon: Heading2Icon,
      attrs: { level: 2 },
      active: isNodeActive(schema.nodes.heading, { level: 2 }),
    },
    {
      name: "heading",
      label: "Small heading",
      icon: Heading3Icon,
      attrs: { level: 3 },
      active: isNodeActive(schema.nodes.heading, { level: 3 }),
    },
  ];
}
