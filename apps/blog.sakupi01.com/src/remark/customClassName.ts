import { h } from "hastscript";
import type { Root } from "mdast";
import type { Directives } from "mdast-util-directive";
import { visit } from "unist-util-visit";

export const customClassName = () => {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (
        node.type === "containerDirective" ||
        node.type === "leafDirective" ||
        node.type === "textDirective"
      ) {
        const directive = node as Directives;
        if (directive.name === "note") {
          const data = directive.data || (directive.data = {});
          const tagName = directive.type === "textDirective" ? "span" : "aside";

          data.hName = tagName;
          data.hProperties = h(tagName, directive.attributes || {}).properties;
        } else {
          if (directive.name === "figure") return;
          const data = directive.data || (directive.data = {});
          const tagName = "details";
          data.hName = tagName;
          data.hProperties = h(tagName, directive.attributes || {}).properties;
        }
      }
    });
  };
};
