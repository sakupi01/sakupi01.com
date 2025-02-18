declare module "mdast-util-heading-range" {
  function heading(
    node: Node,
    test: string,
    callback: (start: Node, nodes: Node, end: Node) => Node[],
  ): void;
  export = heading;
}

declare module "remarkCollapse" {
  interface Options {
    test: string;
    summary?: string | (() => string);
  }
}

declare function remarkCollapse(
  options: remarkCollapse.Options,
): (tree: import("mdast").Root) => Promise<import("mdast").Root>;

export = remarkCollapse;
