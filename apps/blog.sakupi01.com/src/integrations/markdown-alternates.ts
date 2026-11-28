/**
 * markdown-alternates
 *
 * Writes a Markdown sibling for every built HTML page (`index.html` →
 * `index.md`, `404.html` → `404.md`). The files are plain static assets, so
 * serving them needs no runtime code: a URL rewrite in front of the site maps
 * `Accept: text/markdown` requests onto them.
 */
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import type { Element, ElementContent, Nodes, Root } from "hast";
import { h } from "hastscript";
import type { FootnoteDefinition, FootnoteReference } from "mdast";
import rehypeParse from "rehype-parse";
import rehypeRemark, {
  type Options as RehypeRemarkOptions,
} from "rehype-remark";
import remarkGfm from "remark-gfm";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { EXIT, SKIP, visit } from "unist-util-visit";

/** Same prefix as `FN_PREFIX` in src/rehype/rehype-sidenote-anchors.ts. */
const FOOTNOTE_ID_PREFIX = "user-content-fn-";
/** The heading that astro.config.mjs passes to remark-toc and remark-collapse. */
const TABLE_OF_CONTENTS = "Table of Contents";
const HEADING_TAGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);
const EMBED_TAGS = new Set(["iframe", "video", "audio"]);

interface ConvertOptions {
  /** Error pages have no URL of their own, so `url` is left out. */
  isErrorPage?: boolean;
}

function isElement(node: Nodes | undefined, tagName?: string): node is Element {
  return (
    node?.type === "element" &&
    (tagName === undefined || node.tagName === tagName)
  );
}

function hasClass(node: Element, name: string): boolean {
  const { className } = node.properties;
  return Array.isArray(className) && className.includes(name);
}

function textOf(node: Nodes): string {
  if (node.type === "text") return node.value;
  return "children" in node ? node.children.map(textOf).join("") : "";
}

function cleanText(node: Nodes | undefined): string {
  return node ? textOf(node).replace(/\s+/g, " ").trim() : "";
}

function find(
  tree: Nodes,
  test: (node: Element) => boolean
): Element | undefined {
  let found: Element | undefined;
  visit(tree, "element", (node) => {
    if (!test(node)) return undefined;
    found = node;
    return EXIT;
  });
  return found;
}

function findAll(tree: Nodes, test: (node: Element) => boolean): Element[] {
  const found: Element[] = [];
  visit(tree, "element", (node) => {
    if (test(node)) found.push(node);
  });
  return found;
}

function attribute(node: Element | undefined, name: string): string {
  const value = node?.properties[name];
  return typeof value === "string" ? value : "";
}

function absoluteUrl(value: string, base: URL): string {
  if (value === "" || value.startsWith("#")) return value;
  try {
    return new URL(value, base).href;
  } catch {
    // Keep what the author wrote; an unparsable URL is still readable text.
    return value;
  }
}

function linkCard(node: Element): Element {
  const title = cleanText(find(node, (el) => hasClass(el, "rlc-title")));
  const description = cleanText(
    find(node, (el) => hasClass(el, "rlc-description"))
  );
  const href = attribute(node, "href");
  return h("p", [
    h("a", { href }, title || href),
    description ? `: ${description}` : "",
  ]);
}

function postCard(node: Element): Element {
  const link = find(node, (el) => el.tagName === "a");
  const title = cleanText(find(node, (el) => el.tagName === "h2"));
  const date = attribute(
    find(node, (el) => el.tagName === "time"),
    "dateTime"
  );
  const excerpt = cleanText(find(node, (el) => hasClass(el, "excerpt")));
  const details = [date, excerpt].filter(Boolean).join(" — ");
  return h("li", [
    h("a", { href: attribute(link, "href") }, title),
    details ? ` (${details})` : "",
  ]);
}

/** An iframe, video or audio as a link to its source; nothing without one. */
function embedLink(node: Element, base: URL): Element | undefined {
  const source =
    attribute(node, "src") ||
    attribute(
      find(node, (el) => el.tagName === "source"),
      "src"
    );
  if (source === "") return undefined;
  const href = absoluteUrl(source, base);
  return h("p", [h("a", { href }, attribute(node, "title") || href)]);
}

function dropDuplicateCaption(figure: Element): void {
  const image = find(figure, (el) => el.tagName === "img");
  const alt = attribute(image, "alt").trim();
  figure.children = figure.children.filter(
    (child) => !(isElement(child, "figcaption") && cleanText(child) === alt)
  );
}

/** A GFM table cell is one line, so a line break in it becomes a space. */
function flattenLineBreaks(cell: Element): void {
  visit(cell, "element", (node, index, parent) => {
    if (node.tagName === "br" && parent && index !== undefined) {
      parent.children[index] = { type: "text", value: " " };
    }
  });
}

/**
 * Rewrites the site's own markup into plain HTML that converts to readable
 * Markdown, and drops what only makes sense in a browser.
 */
function prepare(main: Element, base: URL): void {
  visit(main, "element", (node, index, parent) => {
    if (!parent || index === undefined) return undefined;
    const siblings = parent.children as ElementContent[];
    const replaceWith = (
      replacement: Element | undefined
    ): [typeof SKIP, number] => {
      if (replacement) siblings[index] = replacement;
      else siblings.splice(index, 1);
      return [SKIP, index];
    };

    if (
      hasClass(node, "article-toc") ||
      hasClass(node, "article-meta") ||
      hasClass(node, "dates") ||
      "dataFootnoteBackref" in node.properties ||
      // The collapsed table of contents repeats the headings that follow it.
      (node.tagName === "h2" && node.properties.id === "table-of-contents") ||
      (node.tagName === "details" &&
        cleanText(
          node.children.find((child) => isElement(child, "summary"))
        ) === TABLE_OF_CONTENTS)
    ) {
      return replaceWith(undefined);
    }
    if (hasClass(node, "rlc-container")) return replaceWith(linkCard(node));
    if (hasClass(node, "blog-post-card")) return replaceWith(postCard(node));
    if (EMBED_TAGS.has(node.tagName)) {
      return replaceWith(embedLink(node, base));
    }
    if (node.tagName === "baseline-status") {
      return replaceWith(h("p", `Baseline: ${attribute(node, "featureid")}`));
    }

    if (HEADING_TAGS.has(node.tagName)) {
      // rehype-autolink-headings wraps the heading text in a self link.
      const [only] = node.children;
      if (
        node.children.length === 1 &&
        isElement(only, "a") &&
        attribute(only, "href").startsWith("#")
      ) {
        node.children = only.children;
      }
    } else if (node.tagName === "pre") {
      const language = attribute(node, "dataLanguage");
      const code = node.children.find((child) => isElement(child, "code"));
      if (isElement(code) && language && language !== "plaintext") {
        code.properties.className = [`language-${language}`];
      }
    } else if (node.tagName === "td" || node.tagName === "th") {
      flattenLineBreaks(node);
    } else if (node.tagName === "aside") {
      node.tagName = "blockquote";
    } else if (node.tagName === "summary") {
      node.children = [h("strong", node.children)];
    } else if (node.tagName === "figure") {
      dropDuplicateCaption(node);
    } else if (node.tagName === "a") {
      node.properties.href = absoluteUrl(attribute(node, "href"), base);
    } else if (node.tagName === "img") {
      node.properties.src = absoluteUrl(attribute(node, "src"), base);
    }
    return undefined;
  });
}

function footnoteIdentifier(value: string): string | undefined {
  const id = value.replace(/^#/, "");
  if (!id.startsWith(FOOTNOTE_ID_PREFIX)) return undefined;
  const label = id.slice(FOOTNOTE_ID_PREFIX.length);
  try {
    return decodeURIComponent(label);
  } catch {
    // A label such as "50%of" is not a valid escape; it is already readable.
    return label;
  }
}

const handlers: NonNullable<RehypeRemarkOptions["handlers"]> = {
  // remark-breaks turned single newlines into <br>; write them back as such.
  br: () => ({ type: "text", value: "\n" }),
  sup(state, node: Element) {
    const reference = node.children.find(
      (child) => isElement(child, "a") && "dataFootnoteRef" in child.properties
    );
    const identifier = isElement(reference)
      ? footnoteIdentifier(attribute(reference, "href"))
      : undefined;
    if (identifier === undefined) return state.all(node);
    return {
      type: "footnoteReference",
      identifier,
      label: identifier,
    } satisfies FootnoteReference;
  },
  section(state, node: Element) {
    if (!("dataFootnotes" in node.properties)) {
      return state.toFlow(state.all(node));
    }
    return findAll(node, (el) => el.tagName === "li").flatMap((item) => {
      const identifier = footnoteIdentifier(attribute(item, "id"));
      if (identifier === undefined) return [];
      return [
        {
          type: "footnoteDefinition",
          identifier,
          label: identifier,
          children: state.toFlow(state.all(item)),
        } satisfies FootnoteDefinition,
      ];
    });
  },
};

const processor = unified()
  .use(rehypeRemark, { handlers })
  .use(remarkGfm)
  .use(remarkStringify, { bullet: "-", rule: "-" });

function frontmatter(
  fields: Record<string, string | string[] | undefined>
): string {
  const lines = Object.entries(fields).flatMap(([key, value]) => {
    if (value === undefined || value.length === 0) return [];
    const scalar = Array.isArray(value)
      ? `[${value.map((item) => JSON.stringify(item)).join(", ")}]`
      : JSON.stringify(value);
    return [`${key}: ${scalar}`];
  });
  return `---\n${lines.join("\n")}\n---\n\n`;
}

/** Converts one built HTML page into Markdown with YAML frontmatter. */
export async function htmlToMarkdown(
  html: string,
  { isErrorPage = false }: ConvertOptions = {}
): Promise<string> {
  const page: Root = unified().use(rehypeParse).parse(html);
  const main = find(page, (el) => el.tagName === "main");
  if (!main) {
    throw new Error("The page has no <main> element to convert.");
  }

  const canonical = attribute(
    find(
      page,
      (el) =>
        el.tagName === "link" &&
        Array.isArray(el.properties.rel) &&
        el.properties.rel.includes("canonical")
    ),
    "href"
  );
  if (canonical === "") {
    throw new Error("The page has no canonical link to resolve URLs against.");
  }
  const base = new URL(canonical);
  // Only article pages carry these; both are removed from the body below.
  const dates = find(main, (el) => hasClass(el, "dates"));
  const articleMeta = find(main, (el) => hasClass(el, "article-meta"));
  const tagList =
    articleMeta && find(articleMeta, (el) => hasClass(el, "tags"));
  const times = dates
    ? findAll(dates, (el) => el.tagName === "time").map((time) =>
        attribute(time, "dateTime")
      )
    : [];
  const tags = tagList
    ? findAll(tagList, (el) => el.tagName === "a").map((tag) =>
        cleanText(tag).replace(/^#/, "")
      )
    : [];

  const header = frontmatter({
    title:
      cleanText(find(main, (el) => el.tagName === "h1")) ||
      cleanText(find(page, (el) => el.tagName === "title")),
    description: attribute(
      find(
        page,
        (el) => el.tagName === "meta" && el.properties.name === "description"
      ),
      "content"
    ),
    url: isErrorPage ? undefined : base.href,
    lang: attribute(
      find(page, (el) => el.tagName === "html"),
      "lang"
    ),
    date: times[0],
    updated: times[1],
    tags,
  });

  prepare(main, base);
  const tree = await processor.run({ type: "root", children: [main] });
  return header + processor.stringify(tree);
}

export function markdownAlternates(): AstroIntegration {
  return {
    name: "markdown-alternates",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const pages = (await readdir(root, { recursive: true })).filter(
          (file) => file.endsWith(".html")
        );

        for (const page of pages) {
          const source = path.join(root, page);
          const markdown = await htmlToMarkdown(
            await readFile(source, "utf8"),
            { isErrorPage: page === "404.html" }
          ).catch((error: unknown) => {
            throw new Error(`Failed to convert ${page} to Markdown.`, {
              cause: error,
            });
          });
          await writeFile(source.replace(/\.html$/, ".md"), markdown);
        }
        logger.info(`Wrote ${pages.length} Markdown pages.`);
      },
    },
  };
}
