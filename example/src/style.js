import styled from "styled-components";

export const Container = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
  max-width: 960px;
  margin: 0 auto;
  padding: 1em;
`;

export const Controls = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Control = styled.div`
  width: 200px;
`;

export const Button = styled.button`
  font-family: -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
  border: none;
  padding: 0.4em 0.8em;
  border-radius: 5px;
  cursor: pointer;
  background: black;
  color: white;
  height: 38px;
`;

export const EditorWrapper = styled.div`
  position: relative;
  padding: 0.4em;
  border: ${props => props.theme.border};
  background: ${props => props.theme.backgroundColor};
  border-radius: 4px;
`;

