import * as React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Editor from "../../src";

const element = document.getElementById("main");
const savedText = localStorage.getItem("saved");
const exampleText = "This is fallback text...";
const defaultValue = JSON.parse(savedText) || exampleText;

const Container = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
`

const Example = () => {
  const handleChange = value => {
    localStorage.setItem("saved", JSON.stringify(value));
  }

  return (
    <Container>
      <h1>Editor</h1>
      
      <Editor
        defaultValue={defaultValue}
        onChange={handleChange}
      />
    </Container>
  )
}

if (element) {
  ReactDOM.render(<Example />, element);
}

