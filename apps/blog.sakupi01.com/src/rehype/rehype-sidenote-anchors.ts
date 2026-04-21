/**
 * rehype-sidenote-anchors
 *
 * Injects CSS Anchor Positioning attributes into remark-gfm footnote HTML
 * so that footnotes can be displayed as sidenotes via pure CSS.
 *
 * Transforms:
 *   <a id="user-content-fnref-1" data-footnote-ref>
 *     → adds style="anchor-name: --fnref-1"
 *
 *   <li id="user-content-fn-1">
 *     → adds style="position-anchor: --fnref-1"
 */
import { visit } from "unist-util-visit";

const FNREF_PREFIX = "user-content-fnref-";
const FN_PREFIX = "user-content-fn-";

function toCssIdent(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function appendStyle(existing: string, declaration: string): string {
  return [existing, declaration].filter(Boolean).join("; ").concat(";");
}

export function rehypeSidenoteAnchors() {
  return (tree: unknown) => {
    visit(
      tree as Parameters<typeof visit>[0],
      "element",
      (node: { tagName: string; properties: Record<string, unknown> }) => {
        const id = node.properties?.id as string | undefined;
        if (!id) return;

        if (
          node.tagName === "a" &&
          id.startsWith(FNREF_PREFIX) &&
          node.properties?.dataFootnoteRef != null
        ) {
          const key = toCssIdent(id.slice(FNREF_PREFIX.length));
          const existing = (node.properties.style as string) || "";
          node.properties.style = appendStyle(
            existing,
            `anchor-name: --fnref-${key}`
          );
        }

        if (id.startsWith(FN_PREFIX) && node.tagName === "li") {
          const key = toCssIdent(id.slice(FN_PREFIX.length));
          const existing = (node.properties.style as string) || "";
          node.properties.style = appendStyle(
            existing,
            `position-anchor: --fnref-${key}`
          );
        }
      }
    );
  };
}
