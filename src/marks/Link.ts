import { Plugin } from "prosemirror-state";
import { toggleMark } from "prosemirror-commands";
import Mark from "./Mark";
import markInputRule from "../lib/markInputRule";
import pasteRule from "../commands/pasteRule";

export default class Link extends Mark {
  get name() {
    return "link";
  }

  get schema() {
    return {
      attrs: {
        href: {
          default: null,
        },
      },
      inclusive: false,
      parseDOM: [
        {
          tag: "a[href]",
          getAttrs: (dom: HTMLElement) => ({
            href: dom.getAttribute("href"),
          }),
        },
      ],
      toDOM: node => [
        "a",
        {
          ...node.attrs,
          rel: "noopener noreferrer nofollow",
        },
        0,
      ],
    };
  }

  keys({ type }) {
    return {
      "Mod-k": toggleMark(type, { href: "" }),
    };
  }

  commands({ type }) {
    return ({ href } = { href: "" }) => toggleMark(type, { href });
  }

  inputRules({ type }) {
    return [
      markInputRule(
        /(?:(?:(https|http)+):\/\/)?(?:\S+(?::\S*)?(@))?(?:(?:([a-z0-9][a-z0-9\-]*)?[a-z0-9]+)(?:\.(?:[a-z0-9\-])*[a-z0-9]+)*(?:\.(?:[a-z]{2,})(:\d{1,5})?))(?:\/[^\s]*)?\s$/gi,
        type,
        url => ({ href: url }),
      )
    ];
  }

  pasteRules({ type }) {
    return [
      pasteRule(
        /(https|http)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-zA-Z]{2,}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g,
        type,
        url => ({ href: url }),
      ),
    ]
  }

  get plugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            click: (view, event: MouseEvent) => {

              // allow opening links in editing mode with the meta/cmd key
              if (view.props.editable && !event.metaKey) {
                return false;
              }

              if (event.target instanceof HTMLAnchorElement) {
                const { href } = event.target;

                if (this.options.onClickLink) {
                  event.stopPropagation();
                  event.preventDefault();
                  this.options.onClickLink(href);
                  return true;
                }
              }

              return false;
            },
          },
        },
      }),
    ]
  }
}