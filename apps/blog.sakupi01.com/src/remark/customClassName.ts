import { h } from "hastscript";
import { visit } from "unist-util-visit";

export const customClassName = () => {
  return (tree: any) => {
    visit(tree, (node) => {
      if (
        node.type === "containerDirective" ||
        node.type === "leafDirective" ||
        node.type === "textDirective"
      ) {
        if (node.name === "note") {
          // biome-ignore lint/suspicious/noAssignInExpressions: <As described https://github.com/remarkjs/remark-directive?tab=readme-ov-file#use>
          const data = node.data || (node.data = {});
          const tagName = node.type === "textDirective" ? "span" : "aside";

          data.hName = tagName;
          data.hProperties = h(tagName, node.attributes || {}).properties;
        } else {
          // biome-ignore lint/suspicious/noAssignInExpressions: <As described https://github.com/remarkjs/remark-directive?tab=readme-ov-file#use>
          const data = node.data || (node.data = {});
          const tagName = "details";
          data.hName = tagName;
          data.hProperties = h(tagName, node.attributes || {}).properties;
        }
      }
    });
  };
};
