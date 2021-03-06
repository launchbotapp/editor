import * as React from "react";
import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import { map } from "lodash";
import styled from "styled-components";
import { Button } from "./components/Button";

export type MenuItem = {
  icon?: typeof React.Component;
  name: string;
  label?: string;
  shortcut?: string;
  attrs?: Record<string, any>;
  active?: (state: EditorState) => boolean;
};

type Props = {
  items: MenuItem[],
  commands: Record<string, any>;
  view: EditorView;
}

export const Menu: React.FC<Props> = ({
  items,
  commands,
  view,
}: Props) => {
  const { state } = view;

  const buttonMarkup = map(items, (item: MenuItem, idx: number) => {
    if (item.name === "separator") {
      return <ToolbarSeparator key={idx} />;
    }
    
    if (!item.icon) {
      return null;
    }

    const Icon = item.icon;
    const isActive = item.active ? item.active(state) : false;

    return (
      <Button
        key={idx}
        active={isActive}
        onClick={() => commands[item.name](item.attrs)}
      >
        <IconWrapper title={item.label}>
          <Icon />
        </IconWrapper>
      </Button>
    )
  });

  return (
    <Wrapper>
      {buttonMarkup}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: block;
  line-height: 0;
`;

const IconWrapper = styled.span`
  svg {
    fill: ${props => props.theme.iconColor}
  }
`;

const ToolbarSeparator = styled.div`
  height: 24px;
  width: 1px;
  background: ${props => props.theme.borderColor};
  display: inline-block;
  margin-right: 8px;
`;