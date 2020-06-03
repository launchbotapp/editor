import * as React from "react";
import ReactDOM from "react-dom";
import Editor from "../../src";

const element = document.getElementById("main");
const savedText = localStorage.getItem("saved");
const exampleText = "This is fallback text...";
const defaultValue = JSON.parse(savedText) || exampleText;

const Example = () => {
  const handleChange = value => {
    localStorage.setItem("saved", JSON.stringify(value));
  }

  return (
    <div>
      <h1>Hello, World</h1>

      <Editor
        defaultValue={defaultValue}
        onChange={handleChange}
      />
    </div>
  )
}

if (element) {
  ReactDOM.render(<Example />, element);
}