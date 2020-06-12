import * as React from "react";
import { Portal } from "react-portal";
import { useEffect, useState, createRef } from "react";
import { isEqual } from "lodash";
import styled from "styled-components";
import isMarkActive from "../../queries/isMarkActive";
import getMarkRange from "../../queries/getMarkRange";
import formattingMenuItems from "../Menu/formatting";
import { EditorView } from "prosemirror-view";
import { Menu } from "../Menu";
import { LinkEditor } from "../LinkEditor";
const SSR = typeof window === "undefined";

type Props = {
  view: EditorView;
  commands: Record<string, any>;
}

type Position = {
  left: number;
  top: number;
}

const menuRef = createRef<HTMLDivElement>();

export const FloatingToolbar: React.FC<Props> = ({
  view,
  commands,
}: Props) => {
  const { state } = view;
  const { selection } = state;
  const [isActive, setIsActive] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({
    top: 0,
    left: -1000,
  });

  useEffect(() => {
    setIsActive(!selection.empty);
  }, [selection]);

  const link = isMarkActive(state.schema.marks.link)(state);
  const range = getMarkRange(selection.$from, state.schema.marks.link)

  const getPosition = () => {
    // If there is no selection, the selection is empty or the selection is a
    // NodeSelection instead of a TextSelection then hide the formatting
    // toolbar offscreen
    if (
      !selection ||
      !menuRef.current ||
      selection.empty ||
      SSR
    ) {
      return {
        top: 0,
        left: -1000,
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
  }, [selection]);

  return (
    <Portal>
      <Wrapper
        ref={menuRef}
        active={isActive}
        top={position.top}
        left={position.left}
      >
        {link && range ? (
          <LinkEditor
            mark={range.mark}
            view={view}
          />
        ) : (
          <MenuWrapper>
            <Menu
              items={formattingMenuItems(state)}
              commands={commands}
              view={view}
              surface={"light"}
            />
          </MenuWrapper>
        )}
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
  display: flex;
  align-items: center;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  background: white;
  color: black;
  z-index: 999;
  box-sizing: border-box;
  border-radius: 5px;
  pointer-events: none;
  white-space: nowrap;
  border: 1px solid #CCCCCC;
  box-shadow: rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  visibility: hidden;

  ${({ active }) =>
    active &&
    `
    transform: translateY(-6px) scale(1);
    pointer-events: all;
    visibility: visible;
  `};
`;

const MenuWrapper = styled.div`
  padding: 0.4em 0.8em;
`;