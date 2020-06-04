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
`;

const Button = styled.button`
  font-family: -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
  border: none;
  padding: 0.4em 0.8em;
  border-radius: 5px;
  cursor: pointer;
  background: black;
  color: white;
`;

const EditorWrapper = styled.div`
  position: relative;
  padding: 1em; 
`;

const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  border-radius: 5px;
  border: ${props => props.readOnly ? "none" : "2px solid #EEEEEE"};
  background: ${props => props.readOnly ? "#f8f8f8" : "white"};
`;

const Example = () => {
  const [readOnly, setReadOnly] = useState(false);

  const handleChange = value => {
    localStorage.setItem("saved", JSON.stringify(value));
  }

  // <iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FbFYh13zq9XDbAY1D8nxawV%2FUntitled%3Fnode-id%3D0%253A1&chrome=DOCUMENTATION" allowfullscreen></iframe>
  // https://www.youtube.com/watch?v=p98Tghoww1k

  return (
    <Container>
      <h1>Editor</h1>

      <div style={{marginBottom: "1em"}}>
        <Button type="button" onClick={() => setReadOnly(!readOnly)}>
          {readOnly ? "👀 Read only" : "📝 Editable"}
        </Button>
      </div>
      
      <EditorWrapper>
        <Editor
          defaultValue={defaultValue}
          onChange={handleChange}
          readOnly={readOnly}
        />

        <Backdrop
          readOnly={readOnly}
        />
      </EditorWrapper>
    </Container>
  )
}

if (element) {
  ReactDOM.render(<Example />, element);
}

