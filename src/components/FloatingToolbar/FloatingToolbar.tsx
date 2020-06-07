import * as React from "react";
import { Portal } from "react-portal";
import { useEffect, useState, createRef } from "react";
import { isEqual } from "lodash";
import styled from "styled-components";
import { EditorView } from "prosemirror-view";
import { Menu } from "../Menu";
import formattingMenuItems from "../Menu/formatting";
const SSR = typeof window === "undefined";

type Props = {
  view: EditorView;
  commands: Record<string, any>;
}

type Position = {
  left: number;
  top: number;
}

export const FloatingToolbar: React.FC<Props> = ({
  view,
  commands,
}: Props) => {
  const menuRef = createRef<HTMLDivElement>();
  const [position, setPosition] = useState<Position>({
    top: 0,
    left: -1000,
  });
  const { state } = view;
  const { selection } = state;
  const isActive = !selection.empty;

  const getPosition = () => {
    // If there is no selection, the selection is empty or the selection is a
    // NodeSelection instead of a TextSelection then hide the formatting
    // toolbar offscreen
    if (
      !selection ||
      !menuRef.current ||
      selection.empty ||
      SSR ||
      !view.hasFocus()
    ) {
      return {
        left: -1000,
        top: 0,
      };
    }

    // find center-ish point of selection
    const startPos = view.coordsAtPos(selection.$from.pos);
    const endPos = view.coordsAtPos(selection.$to.pos);

    const halfSelection = Math.abs(endPos.left - startPos.left) / 2;
    const centerOfSelection = startPos.left + halfSelection;

    // handling for edge of page
    const { offsetWidth, offsetHeight } = menuRef.current;
    const margin = 12;
    const left = Math.min(
      window.innerWidth - offsetWidth - margin,
      Math.max(margin, centerOfSelection - offsetWidth / 2)
    );
    const top = Math.min(
      window.innerHeight - offsetHeight - margin,
      Math.max(margin, startPos.top - offsetHeight)
    );

    return {
      left: Math.round(left + window.scrollX),
      top: Math.round(top + window.scrollY),
    };
  }

  useEffect(() => {
    const newPosition = getPosition();

    if (!isEqual(newPosition, position)) {
      setPosition(newPosition);
    }
  });

  return (
    <Portal>
      <Wrapper
        ref={menuRef}
        active={isActive}
        top={position.top}
        left={position.left}
      >
        <Menu
          items={formattingMenuItems(state)}
          commands={commands}
          view={view}
          surface={"dark"}
        />
      </Wrapper>
    </Portal>
  )
}

const Wrapper = styled.div<{
  active: boolean;
  top: number;
  left: number;
}>`
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  background: black;
  color: white;
  z-index: 999;
  padding: 0.4em;
  border-radius: 5px;
`;