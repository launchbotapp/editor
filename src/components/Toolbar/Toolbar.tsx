import * as React from "react";
import styled from "styled-components";
import formattingMenuItems from "../Menu/formatting";
import { EditorView } from "prosemirror-view";
import { Menu, MenuItem } from "../Menu";
import blockMenuItems from "../Menu/block";

type Props = {
  view: EditorView;
  commands: Record<string, any>;
}

export const Toolbar: React.FC<Props> = ({
  view,
  commands,
}: Props) => {
  const separator = { name: "separator" };
  let items: MenuItem[] = [
    ...formattingMenuItems(view.state),
    separator,
    ...blockMenuItems(view.state),
  ]

  return (
    <StyledToolbar>
      <Menu
        view={view}
        commands={commands}
        items={items}
        surface={"light"}
      />
    </StyledToolbar>
  )
}

const StyledToolbar = styled.div`
  position: relative;
  padding-bottom: 1em;
  margin-bottom: 1em;
  z-index: 1;
  border-bottom: 1px solid #eeeeee;
  display: inline-flex;
  width: 100%;
`;