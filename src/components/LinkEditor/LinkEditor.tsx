import * as React from "react";
import { useState } from "react";
import { EditorView } from "prosemirror-view";
import { Mark } from "prosemirror-model";
import isUrl from "../../lib/isUrl";
import styled from "styled-components";

type Props = {
  mark: Mark;
  view: EditorView;
}

export const LinkEditor: React.FC<Props> = ({
  mark,
  view,
}: Props) => {
  const [value, setValue] = useState<string>("");
  const handleChange = (event) => {
    setValue(event.target.value.trim());
  }

  const getCleanHref = () => {
    let href = (value || "").trim();
    if (!href) {
      console.log("remove mark")
    }

    // If the input doesn't start with a protocol or relative slash, make sure
    // a protocol is added to the beginning
    if (!isUrl(href) && !href.startsWith("/")) {
      href = `https://${href}`;
    }

    return href;
  }

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    
    const href = getCleanHref();
    console.log(`handleSubmit::${href}`)
    save(href);
  }

  const save = (href: string): void => {
    const { state, dispatch } = view;
    const { selection } = state;
    const { from, to } = selection;
    const markType = state.schema.marks.link;

    dispatch(
      state.tr
        .removeMark(from, to, markType)
        .addMark(from, to, markType.create({ href }))
    );
  }

  return (
    <Wrapper>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={value}
          placeholder="https://"
          onChange={handleChange}
        />

        <button type="submit">apply</button>
      </form>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: inline-flex;
  position: relative;
`;

const Input = styled.input`
  font-size: 1em;
  border-radius: 3px;
  padding: 0.4em;
  border: 1px solid #CCCCCC;
  margin: 0;
  outline: none;
  flex-grow: 1;
`;