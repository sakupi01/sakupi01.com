import type { Root, Paragraph } from "mdast";
import type { ContainerDirective } from "mdast-util-directive";
import type { Plugin, Transformer } from "unified";
import { visit } from "unist-util-visit";

interface DirectiveData {
  directiveLabel?: boolean;
  hName?: string;
}

export const remarkFigureCaption: Plugin<[], Root> = () => {
  const transformer: Transformer<Root> = (tree) => {
    visit(tree, "containerDirective", (node: ContainerDirective) => {
      if (node.name !== "figure") return;

      const labelNode = node.children.find(
        (child) =>
          (child.data as DirectiveData | undefined)?.directiveLabel === true
      );

      const labelChildren =
        labelNode && "children" in labelNode ? labelNode.children : [];

      node.children = node.children.filter(
        (child) =>
          (child.data as DirectiveData | undefined)?.directiveLabel !== true
      );

      node.data ??= {};
      (node.data as DirectiveData).hName = "figure";

      if (labelChildren.length > 0) {
        const figcaption: Paragraph = {
          type: "paragraph",
          data: { hName: "figcaption" } as DirectiveData,
          children: labelChildren as Paragraph["children"],
        };
        node.children.unshift(figcaption);
      }
    });
  };
  return transformer;
};
