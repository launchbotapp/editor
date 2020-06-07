import {
  BulletedListIcon,
  OrderedListIcon,
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
  ];
}
