import * as React from "react";
import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import _ from "lodash";
import styled from "styled-components";
import {Button} from "./components/Button";

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

  const buttonMarkup = _.map(items, (item: MenuItem) => {
    if (!item.icon) {
      return null;
    }
    
    const Icon = item.icon;
    const isActive = item.active ? item.active(state) : false;
    return (
      <Button
        key={item.name}
        active={isActive}
        onClick={() => commands[item.name]()}
      >
        <span title={item.label}>
          <Icon color={"white"} />
        </span>
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