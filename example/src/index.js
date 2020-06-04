import * as React from "react";
import { useState } from "react";
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

const Button = styled.button`
  font-family: -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
  border: none;
  padding: 0.4em 0.8em;
  border-radius: 5px;
  cursor: pointer;
`

const Example = () => {
  const [readOnly, setReadOnly] = useState(true);

  const handleChange = value => {
    localStorage.setItem("saved", JSON.stringify(value));
  }


  return (
    <Container>
      <h1>Editor</h1>

      <div style={{marginBottom: "1em"}}>
        <Button type="button" onClick={() => setReadOnly(!readOnly)}>
          {readOnly ? "👀 Read only" : "📝 Editable"}
        </Button>
      </div>
      
      <Editor
        defaultValue={defaultValue}
        onChange={handleChange}
        readOnly={readOnly}
      />
    </Container>
  )
}

if (element) {
  ReactDOM.render(<Example />, element);
}

