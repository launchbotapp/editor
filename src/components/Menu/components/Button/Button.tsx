import * as React from "react";
import styled from "styled-components";

type Props = {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<Props> = ({
  active,
  onClick,
  children,
}: Props) => {
  return (
    <MenuButton
      onClick={onClick}
      active={active}
    >
      {children}
    </MenuButton>
  )
};

const MenuButton = styled.button<{
  active: boolean;
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
  opacity: 0.65;
  outline: none;
  border-radius: 5px;

  &:last-child {
    margin-right: 0;
  }

  ${props => props.active && `
    opacity: 1;
    background: ${props.theme.backgroundAccentColor}
  `}
`;