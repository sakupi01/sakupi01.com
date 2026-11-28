import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { test } from "node:test";

const dist = new URL("../dist/", import.meta.url);
const app = new URL("../", import.meta.url);
const origin = "https://blog.sakupi01.com";
const contentSignal = "ai-train=no, search=yes, ai-input=yes";
const article = "dev/articles/organizing-fec-f-2026";

async function readDist(path) {
  return readFile(new URL(path, dist), "utf8");
}

async function htmlPages() {
  const files = await readdir(dist, { recursive: true });
  return files.filter((file) => file.endsWith(".html"));
}

function structuredData(html) {
  const matches = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
    ),
  ];
  return matches.map((match) => JSON.parse(match[1]));
}

function graphTypes(documents) {
  return new Set(
    documents.flatMap((document) =>
      (document["@graph"] ?? []).map((entry) => entry["@type"])
    )
  );
}

function graphEntry(documents, type) {
  return documents
    .flatMap((document) => document["@graph"] ?? [])
    .find((entry) => entry["@type"] === type);
}

function textOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&#39;", "'")
    .replaceAll("&quot;", '"')
    .replace(/\s+/g, " ")
    .trim();
}

function visibleMainText(html) {
  return textOf(html.match(/<main(?:\s[^>]*)?>([\s\S]*?)<\/main>/)?.[1] ?? "");
}

function openGraphType(html) {
  return html.match(/<meta property="og:type" content="([^"]+)">/)?.[1];
}

/**
 * Markdown with code removed, so HTML quoted as an example is not counted.
 * A fence may sit inside a list item, a blockquote or a footnote, where each
 * line starts with indentation or `>`.
 */
function proseOf(markdown) {
  return markdown
    .replace(/^([ \t>]*)(`{3,}|~{3,})[^\n]*\n[\s\S]*?^[ \t>]*\2[ \t]*$/gm, "")
    .replace(/`[^`\n]*`/g, "");
}

function headerRule(headers, path) {
  return (
    headers.split("\n\n").find((block) => block.startsWith(`${path}\n`)) ?? ""
  );
}

test("homepage publishes truthful site identity", async () => {
  const html = await readDist("index.html");
  const documents = structuredData(html);
  const types = graphTypes(documents);

  assert.ok(types.has("Person"));
  assert.ok(types.has("WebSite"));
  assert.ok(types.has("Blog"));
  assert.ok(!types.has("Organization"));
  const person = graphEntry(documents, "Person");
  const website = graphEntry(documents, "WebSite");
  const blog = graphEntry(documents, "Blog");
  assert.equal(person.name, "saku");
  assert.equal(person.url, "https://sakupi01.com/");
  assert.ok(person.sameAs.includes("https://github.com/sakupi01"));
  assert.equal(website.url, `${origin}/`);
  assert.equal(website.author["@id"], person["@id"]);
  assert.equal(blog.isPartOf["@id"], website["@id"]);
  assert.equal(openGraphType(html), "website");
});

test("pages link to About, Contact and the shared privacy policy", async () => {
  for (const path of ["index.html", `${article}/index.html`]) {
    const html = await readDist(path);
    assert.match(html, new RegExp(`href="${origin}/about/"`), path);
    assert.match(html, new RegExp(`href="${origin}/contact/"`), path);
    assert.match(html, /href="https:\/\/sakupi01\.com\/privacy\/"/, path);
  }
  assert.doesNotMatch(await readDist("index.html"), /About this blog/);
  await assert.rejects(access(new URL("privacy/index.html", dist)));
});

test("navigation and post links are well-formed whatever the build variables look like", async () => {
  const home = await readDist("index.html");
  for (const path of ["dev/", "life/", "tags/", "feed.xml"]) {
    assert.match(home, new RegExp(`href="${origin}/${path}"`), path);
  }

  for (const path of ["index.html", "dev/index.html", "recents/index.html"]) {
    const html = await readDist(path);
    const links = [
      ...html.matchAll(/<a href="([^"]+)" class="title-container"/g),
    ].map((match) => match[1]);
    const housePosts = links.filter((link) => !link.includes("zenn.dev"));

    assert.ok(housePosts.length > 0, path);
    for (const link of housePosts) {
      assert.match(link, /^https:\/\/blog\.sakupi01\.com\/[^/].*\/$/, link);
    }
    for (const link of links) {
      assert.doesNotMatch(new URL(link).pathname, /\/\//, link);
    }
  }
});

test("articles publish BlogPosting structured data", async () => {
  const html = await readDist(`${article}/index.html`);
  const documents = structuredData(html);
  const posting = graphEntry(documents, "BlogPosting");
  const heading = textOf(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "");

  assert.ok(posting);
  assert.equal(posting.url, `${origin}/${article}/`);
  assert.equal(posting.mainEntityOfPage, posting.url);
  assert.equal(posting.headline, heading);
  assert.ok(!Number.isNaN(Date.parse(posting.datePublished)));
  assert.ok(
    Date.parse(posting.dateModified) >= Date.parse(posting.datePublished)
  );
  assert.equal(posting.image, `${origin}/cherry-blossom.png`);
  assert.equal(posting.inLanguage, "ja-JP");
  assert.equal(posting.author["@id"], "https://sakupi01.com/#person");
  assert.equal(openGraphType(html), "article");
});

test("404 contains useful recovery links", async () => {
  const html = await readDist("404.html");
  assert.match(html, /Page not found/);
  assert.match(html, /href="\/"/);
  assert.match(html, /href="\/sitemap-index\.xml"/);
  assert.match(html, /href="\/llms\.txt"/);
  assert.ok(visibleMainText(html).length >= 20);
});

for (const page of ["about", "contact"]) {
  test(`${page} is a substantive trust page`, async () => {
    const html = await readDist(`${page}/index.html`);
    assert.equal(openGraphType(html), "website");
    assert.ok(
      visibleMainText(html).length >= 500,
      `${page} must contain at least 500 visible characters`
    );
  });
}

test("llms.txt explains when agents should use the site", async () => {
  const llms = await readDist("llms.txt");
  assert.match(llms, /^# saku's blog/m);
  assert.match(llms, /^## When to use this site$/m);
  assert.match(llms, /^## When not to use this site$/m);
  assert.match(llms, /Accept: text\/markdown/);
  assert.match(llms, /index\.md/);
  assert.match(llms, /sitemap-index\.xml/);
  assert.match(llms, /feed\.xml/);
  assert.match(llms, /blog\.json/);
  assert.match(llms, /https:\/\/sakupi01\.com\/privacy\//);
  assert.ok(llms.includes(`](${origin}/${article}/)`));
});

test("the draft article is absent from every public artifact", async () => {
  const slug = "making-blog-agent-ready";
  for (const file of ["index.html", "index.md"]) {
    await assert.rejects(access(new URL(`dev/articles/${slug}/${file}`, dist)));
  }

  for (const path of [
    "index.html",
    "index.md",
    "sitemap-0.xml",
    "feed.xml",
    "blog.json",
    "llms.txt",
  ]) {
    assert.doesNotMatch(await readDist(path), new RegExp(slug), path);
  }
});

test("code is not mistaken for page chrome, wherever the fence sits", () => {
  const nested = [
    "Intro with `<style>` inline.",
    "",
    "- item",
    "",
    "  ```html",
    "  <script>alert(1)</script>",
    "  [home](/index.html)",
    "  ```",
    "",
    "> ```css",
    "> <style></style>",
    "> ```",
    "",
    "```html",
    "<iframe></iframe>",
    "```",
    "",
    "After.",
  ].join("\n");

  assert.doesNotMatch(proseOf(nested), /<|\]\(/);
  assert.match(proseOf("Text <script> outside code"), /<script>/);
});

test("every HTML page has a Markdown version without page chrome", async () => {
  const pages = await htmlPages();
  assert.ok(pages.length > 0);

  for (const page of pages) {
    const path = page.replace(/\.html$/, ".md");
    const markdown = await readDist(path);
    const prose = proseOf(markdown);

    assert.match(markdown, /^---\ntitle: "/, path);
    assert.doesNotMatch(
      prose,
      /(?<!\\)<(?:script|style|iframe|svg)\b|<!doctype/i,
      path
    );
    assert.doesNotMatch(prose, /\]\(\/(?!\/)/, `${path} has a relative link`);
    // The forms a leftover table of contents or link card image would take.
    assert.doesNotMatch(
      markdown,
      /^(?:#+ |\*\*)Table of Contents|\/remark-link-card\//m,
      path
    );
  }
});

test("every HTML page advertises its Markdown version", async () => {
  const pages = (await htmlPages()).filter((page) => page !== "404.html");

  for (const page of pages) {
    const html = await readDist(page);
    const href = html.match(
      /<link rel="alternate" type="text\/markdown" href="([^"]+)">/
    )?.[1];
    assert.ok(href, `${page} has no Markdown alternate link`);

    const url = new URL(href);
    assert.equal(url.origin, origin, page);
    await access(new URL(`.${decodeURIComponent(url.pathname)}`, dist));
  }
});

test("article Markdown carries its metadata and none of the page furniture", async () => {
  const markdown = await readDist(`${article}/index.md`);
  const title = markdown.match(/^title: (".*")$/m)?.[1];

  assert.match(markdown, new RegExp(`^url: "${origin}/${article}/"$`, "m"));
  assert.match(markdown, /^date: "\d{4}-\d{2}-\d{2}"$/m);
  assert.match(markdown, /^updated: "\d{4}-\d{2}-\d{2}"$/m);
  assert.match(markdown, /^tags: \[".+"\]$/m);
  assert.ok(title);
  assert.ok(markdown.includes(`\n# ${JSON.parse(title)}\n`));
  assert.match(
    markdown,
    /!\[[^\]]*\]\(https:\/\/blog\.sakupi01\.com\/_astro\//
  );
  // Dates, share buttons and comments belong to the HTML layout.
  assert.doesNotMatch(
    markdown,
    /Published on|Updated on|intent\/(?:tweet|compose)|giscus/i
  );
});

test("list pages turn post cards into titled links", async () => {
  const markdown = await readDist("index.md");
  const items = markdown.split("\n").filter((line) => line.startsWith("- "));

  assert.ok(items.length > 0);
  for (const item of items) {
    assert.match(item, /^- \[.+\]\(https:\/\/[^)]+\) \(\d{4}-\d{2}-\d{2}/);
  }
  assert.doesNotMatch(markdown, /Read more|Published on/);
});

test("the Markdown 404 offers absolute recovery links", async () => {
  const markdown = await readDist("404.md");
  assert.match(markdown, /^# Page not found$/m);
  assert.match(markdown, new RegExp(`\\]\\(${origin}/\\)`));
  assert.match(markdown, new RegExp(`\\]\\(${origin}/sitemap-index\\.xml\\)`));
  assert.match(markdown, new RegExp(`\\]\\(${origin}/llms\\.txt\\)`));
  assert.doesNotMatch(markdown, /^url: /m);
});

test("robots, static headers and the Worker declare one content policy", async () => {
  const robots = await readDist("robots.txt");
  const headers = await readDist("_headers");
  const worker = await readFile(new URL("src/worker.ts", app), "utf8");

  assert.ok(robots.includes(`Content-Signal: ${contentSignal}`));
  assert.match(robots, /User-agent: __usage_ai-training\s+Disallow: \//);
  assert.ok(headers.includes(`Content-Signal: ${contentSignal}`));
  assert.ok(worker.includes(`"${contentSignal}"`));
});

test("static headers describe each representation", async () => {
  const headers = await readDist("_headers");
  const everything = headerRule(headers, "/*");
  const link = headerRule(headers, "/").match(/^ {2}Link: (.+)$/m)?.[1] ?? "";
  const relations = [...link.matchAll(/rel="([^"]+)"/g)].map(
    (match) => match[1]
  );

  assert.match(everything, /^ {2}Vary: Accept, Accept-Encoding$/m);
  assert.match(everything, /^ {2}Strict-Transport-Security: max-age=\d+$/m);
  assert.match(
    headerRule(headers, "/*.md"),
    /^ {2}Content-Type: text\/markdown; charset=utf-8$/m
  );
  // The Markdown files point search engines at the HTML page instead of
  // opting out of indexing, because the same file answers the page's own URL.
  assert.ok(
    headerRule(headers, "/*index.md").includes(
      `Link: <${origin}/:splat>; rel="canonical"`
    )
  );
  assert.doesNotMatch(headerRule(headers, "/*.md"), /X-Robots-Tag/);
  assert.match(headerRule(headers, "/404.md"), /^ {2}X-Robots-Tag: noindex$/m);
  assert.match(
    headerRule(headers, "/llms.txt"),
    /^ {2}Content-Type: text\/plain; charset=utf-8$/m
  );
  for (const feed of ["/blog.json", "/feed.xml"]) {
    assert.match(
      headerRule(headers, feed),
      /^ {2}Access-Control-Allow-Origin: \*$/m
    );
  }

  // Only relation types registered with IANA; "sitemap" is not one of them.
  assert.deepEqual(relations, ["describedby", "alternate", "alternate"]);
  assert.match(link, /<\/llms\.txt>; rel="describedby"/);
  assert.match(link, /<\/index\.md>; rel="alternate"; type="text\/markdown"/);
  assert.match(link, /type="application\/rss\+xml"/);
});

test("tags never differ by letter case alone", async () => {
  const html = await readDist("tags/index.html");
  const tags = [...html.matchAll(/href="\/tags\/([^"/]+)\/"/g)].map((match) =>
    decodeURIComponent(match[1])
  );

  assert.ok(tags.length > 0);
  // A case-insensitive file system, as on macOS, writes both tag pages into
  // one directory, and the deployed site then lacks one of them.
  assert.equal(
    new Set(tags.map((tag) => tag.toLowerCase())).size,
    tags.length,
    tags.join(", ")
  );
});

test("Wrangler serves assets first and can build branch previews", async () => {
  const config = JSON.parse(
    await readFile(new URL("wrangler.json", app), "utf8")
  );

  // Running the Worker first would count every page view against the daily
  // request limit of the Free plan.
  assert.equal(config.assets.run_worker_first, undefined);
  assert.equal(config.assets.not_found_handling, "404-page");
  // `wrangler preview` refuses to run without this block.
  assert.deepEqual(config.previews, {});
});
