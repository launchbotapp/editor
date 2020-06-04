import * as React from "react";
import { wrappingInputRule } from "prosemirror-inputrules";
import toggleList from "../commands/toggleList";
import Node from "./Node";

export default class BulletList extends Node {
  get name() {
    return "embed";
  }

  get schema() {
    return {
      content: "inline*",
      group: "block",
      attrs: {
        href: {},
        component: {},
        matches: {},
      },
      parseDOM: [{ tag: "iframe" }],
      toDOM: node => [
        "iframe",
        { src: node.attrs.href, contentEditable: false },
        0,
      ],
    };
  }

  component({ isEditable, isSelected, node }) {
    const Component = node.attrs.component;

    return (
      <div contentEditable={false}>
        <Component
          attrs={node.attrs}
          isEditable={isEditable}
          isSelected={isSelected}
        />
      </div>
    );
  }
}
