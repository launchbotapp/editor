import * as React from "react";
import { useState } from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
import Select from "react-select";


import Editor from "../../src";
import { lightTheme, darkTheme } from "../../src/theme";
import { weirdTheme } from "./theme";
import {
  Container,
  Controls,
  Control,
  Button,
  EditorWrapper,
} from "./style";

const element = document.getElementById("main");

// storing text to local storage for demo
const savedText = localStorage.getItem("saved");
const defaultValue = JSON.parse(savedText) || null;

// define demo theme options
const themeOptions = [
  { value: "light", label: "Light", theme: lightTheme},
  { value: "dark", label: "Dark", theme: darkTheme},
  { value: "weird", label: "Weird", theme: weirdTheme},
]

const Example = () => {
  const [readOnly, setReadOnly] = useState(false);
  const [activeThemeOption, setThemeOption] = useState(themeOptions[0]);
  const handleChange = value => {
    localStorage.setItem("saved", JSON.stringify(value));
  }

  return (
    <Container>
      <h1>Editor</h1>

      {/* controls for demo styling */}
      <Controls style={{marginBottom: "1em"}}>
        <Control>
          <Button type="button" onClick={() => setReadOnly(!readOnly)}>
            {readOnly ? "👀 Read only" : "📝 Editable"}
          </Button>
        </Control>
        <Control>
          <Select
            options={themeOptions}
            onChange={option => setThemeOption(option)}
            value={activeThemeOption}
          />
        </Control>
      </Controls>
      
      {/* editor */}
      <EditorWrapper theme={activeThemeOption.theme}>  
        <Editor
          initialValue={defaultValue}
          placeholder="Start writing..."
          onChange={handleChange}
          readOnly={readOnly}
          theme={activeThemeOption.theme}
        />
      </EditorWrapper>
    </Container>
  )
}

if (element) {
  ReactDOM.render(<Example />, element);
}
