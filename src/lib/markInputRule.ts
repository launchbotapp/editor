import { MarkType, Mark } from "prosemirror-model";
import { InputRule } from "prosemirror-inputrules";
import { EditorState, Transaction } from "prosemirror-state";
import { toFormattedUrl } from "../lib/isUrl";

function getMarksBetween(start: number, end: number, state: EditorState) {
  let marks: { start: number; end: number; mark: Mark }[] = [];

  state.doc.nodesBetween(start, end, (node, pos) => {
    marks = [
      ...marks,
      ...node.marks.map(mark => ({
        start: pos,
        end: pos + node.nodeSize,
        mark,
      })),
    ];
  });

  return marks;
}

export default function(
  regexp: RegExp,
  markType: MarkType,
  getAttrs?: (match) => {}
): InputRule {
  return new InputRule(
    regexp,
    (state: EditorState, match: string[], start: number, end: number): Transaction | null => {

      const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;

      const { tr } = state;
      const m = match.length - 1;
      let markEnd = end;
      let markStart = start;

      /**
       * links have different regex matching pattern and text replacement handling
       */
      if (markType === markType.schema.marks.link) {
        const matched = match[0];
        const linkStr = matched.substring(0, matched.length - 1);
        const formattedLink = toFormattedUrl(linkStr);

        return tr
          .removeMark(markStart, markEnd, markType)
          .addMark(markStart, markEnd, markType.create({ href: formattedLink }))
          .insertText(" ", end);
      }

      /**
       * supports "normal" marks like bold, italic etc.
       */
      if (match[m]) {
        const matchStart = start + match.indexOf(match[m - 1]);
        const matchEnd = matchStart + match[m - 1].length - 1;
        const textStart = matchStart + match[m - 1].lastIndexOf(match[m]);
        const textEnd = textStart + match[m].length;

        const excludedMarks = getMarksBetween(start, end, state).filter(
          item => item.end > matchStart
        );

        if (excludedMarks.length) {
          return null;
        }

        if (textEnd < matchEnd) {
          tr.delete(textEnd, matchEnd);
        }

        if (textStart > matchStart) {
          tr.delete(matchStart, textStart);
        }

        markStart = matchStart;
        markEnd = markStart + match[m].length;
      }

      tr.addMark(markStart, markEnd, markType.create(attrs));
      tr.removeStoredMark(markType);
      return tr;
    }
  );
}
