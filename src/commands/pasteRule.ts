import { Plugin } from 'prosemirror-state';
import { Slice, Fragment, MarkType, Node } from 'prosemirror-model';

export default function pasteRule(regexp: RegExp, type: MarkType, getAttrs: any) {
  const handler = (fragment: Fragment) => {
    const nodes: Node[] = [];

    fragment.forEach((child: Node) => {
      if (child.isText) {
        //@ts-ignore
        const text: string = child.text;
        let pos = 0;
        let match: RegExpExecArray | null;

        console.log("text::", text)

        do {
          match = regexp.exec(text);

          if (match) {
            console.log("has match")
            const start = match.index;
            const end = start + match[0].length;
            const attrs = getAttrs instanceof Function ? getAttrs(match[0]) : getAttrs;

            if (start > 0) {
              nodes.push(child.cut(pos, start));
            }

            console.log("original::", child)
            const updated = child.cut(start, end).mark(type.create(attrs).addToSet(child.marks));
            console.log("new::", updated)

            nodes.push(updated)

            pos = end;
          }

          if (pos < text.length) {
            nodes.push(child.cut(pos))
          }
        } while (match);

      } else {
        nodes.push(child.copy(handler(child.content)));
      }
    });

    return Fragment.fromArray(nodes);
  }

  return new Plugin ({
    props: {
      transformPasted: slice => new Slice(
        handler(slice.content),
        slice.openStart,
        slice.openEnd,
      )
    }
  })
}

