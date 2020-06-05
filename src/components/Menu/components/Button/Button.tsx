import * as React from "react";
import styled from "styled-components";

type Props = {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  surface: "light" | "dark";
}

export const Button: React.FC<Props> = ({
  active,
  onClick,
  children,
  surface,
}: Props) => {
  return (
    <MenuButton
      onClick={onClick}
      active={active}
      surface={surface}
    >
      {children}
    </MenuButton>
  )
};

const MenuButton = styled.button<{
  active: boolean;
  surface: "light" | "dark";
}>`
  display: inline-block;
  flex: 0;
  width: 24px;
  height: 24px;
  cursor: pointer;
  margin-right: 8px;
  border: none;
  background: none;
  padding: 0;
  opacity: 0.5;
  outline: none;
  border-radius: 5px;

  &:last-child {
    margin-right: 0;
  }

  ${props => props.active && `
    opacity: 1;
  `}

  ${props => props.active && props.surface === "light" && `
    background: #eeeeee;
  `}

`;