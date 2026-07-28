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
 *
 *   If the reference is inside a <details>, the corresponding <li> also gets
 *   data-in-details-li so CSS can treat skipped-contents anchors specially.
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

/** Footnote keys whose reference sits inside a <details>. */
function collectKeysInDetails(tree: Parameters<typeof visit>[0]): Set<string> {
  const keys = new Set<string>();

  visit(tree, "element", (node: { tagName: string }) => {
    if (node.tagName !== "details") return;

    visit(
      node as Parameters<typeof visit>[0],
      "element",
      (child: { tagName: string; properties: Record<string, unknown> }) => {
        const id = child.properties?.id as string | undefined;
        if (
          child.tagName !== "a" ||
          !id?.startsWith(FNREF_PREFIX) ||
          child.properties?.dataFootnoteRef == null
        ) {
          return;
        }
        keys.add(toCssIdent(id.slice(FNREF_PREFIX.length)));
      }
    );
  });

  return keys;
}

export function rehypeSidenoteAnchors() {
  return (tree: unknown) => {
    const root = tree as Parameters<typeof visit>[0];
    const keysInDetails = collectKeysInDetails(root);

    visit(
      root,
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
          if (keysInDetails.has(key)) {
            node.properties.dataInDetailsLi = "";
          }
        }
      }
    );
  };
}
