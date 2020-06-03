import * as React from "react";
import ReactDOM from "react-dom";
import Editor from "../../src";

const element = document.getElementById("main");

const Example = () => {
  return (
    <div>
      <h1>Hello, World</h1>

      <Editor />
    </div>
  )
}

if (element) {
  ReactDOM.render(<Example />, element);
}