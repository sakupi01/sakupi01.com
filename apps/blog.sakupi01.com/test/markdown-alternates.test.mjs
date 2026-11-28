import assert from "node:assert/strict";
import { test } from "node:test";
import { htmlToMarkdown } from "../src/integrations/markdown-alternates.ts";

const canonical = "https://blog.sakupi01.com/dev/articles/sample/";

function page(main, { head = "" } = {}) {
  return `<!doctype html>
<html lang="ja">
  <head>
    <title>Sample | saku's blog</title>
    <meta name="description" content="A sample page.">
    <link rel="canonical" href="${canonical}">
    ${head}
  </head>
  <body>
    <header><a href="/">logo</a></header>
    <main>${main}</main>
    <footer><a href="/about/">About</a></footer>
  </body>
</html>`;
}

/** Converts a `<main>` fragment and returns the Markdown after frontmatter. */
async function body(main) {
  const markdown = await htmlToMarkdown(page(main));
  return markdown.replace(/^---\n[\s\S]*?\n---\n\n/, "");
}

test("frontmatter carries the page metadata", async () => {
  const markdown = await htmlToMarkdown(page("<h1>Sample title</h1>"));
  assert.match(markdown, /^---\ntitle: "Sample title"\n/);
  assert.match(markdown, /^description: "A sample page\."$/m);
  assert.match(markdown, new RegExp(`^url: "${canonical}"$`, "m"));
  assert.match(markdown, /^lang: "ja"$/m);
  assert.doesNotMatch(markdown, /^(?:date|updated|tags): /m);
});

test("frontmatter falls back to <title> and quotes special characters", async () => {
  const html = page("<p>No heading</p>").replace(
    "Sample | saku's blog",
    'A "quoted" title'
  );
  assert.match(await htmlToMarkdown(html), /^title: "A \\"quoted\\" title"$/m);
});

test("an article contributes dates and tags, which leave the body", async () => {
  const markdown = await htmlToMarkdown(
    page(`
      <aside class="article-toc"><nav><a href="#a">Sidebar entry</a></nav></aside>
      <article>
        <div class="hero-section">
          <h1>Article</h1>
          <div class="dates">
            <p>Published on <time datetime="2026-01-02">Jan 2</time></p>
            <p>Updated on <time datetime="2026-03-04">Mar 4</time></p>
          </div>
          <p class="excerpt">Lead paragraph.</p>
        </div>
        <p>Body text.</p>
      </article>
      <div class="article-meta">
        <ul class="tags"><li><a href="/tags/css/">#css</a></li><li><a href="/tags/web%20ui/">#web ui</a></li></ul>
        <ul><li><a href="https://x.com/intent/tweet?url=x">share</a></li></ul>
        <section class="giscus-container">Comments</section>
      </div>
    `)
  );

  assert.match(markdown, /^date: "2026-01-02"$/m);
  assert.match(markdown, /^updated: "2026-03-04"$/m);
  assert.match(markdown, /^tags: \["css", "web ui"\]$/m);
  assert.match(markdown, /^# Article$/m);
  assert.match(markdown, /^Lead paragraph\.$/m);
  assert.match(markdown, /^Body text\.$/m);
  for (const leftover of [
    "Sidebar entry",
    "Published on",
    "Updated on",
    "intent/tweet",
    "Comments",
    "#css",
  ]) {
    assert.ok(!markdown.includes(leftover), `${leftover} is still present`);
  }
});

test("an error page has no url", async () => {
  const markdown = await htmlToMarkdown(page("<h1>Page not found</h1>"), {
    isErrorPage: true,
  });
  assert.doesNotMatch(markdown, /^url: /m);
  assert.match(markdown, /^# Page not found$/m);
});

test("only <main> is converted", async () => {
  const markdown = await body("<p>Content</p>");
  assert.equal(markdown, "Content\n");
});

test("the collapsed table of contents is removed", async () => {
  const withHeading = await body(`
    <h2 id="table-of-contents"><a href="#table-of-contents">Table of Contents</a></h2>
    <p></p>
    <details><summary>Table of Contents</summary><ul><li><a href="#intro">Intro</a></li></ul></details>
    <h2 id="intro"><a href="#intro">Intro</a></h2>
  `);
  assert.equal(withHeading, "## Intro\n");

  const other = await body(
    "<details><summary>More</summary><p>Hidden text</p></details>"
  );
  assert.match(other, /^\*\*More\*\*$/m);
  assert.match(other, /^Hidden text$/m);
});

test("heading self links are unwrapped, real links are kept", async () => {
  assert.equal(
    await body('<h2 id="a"><a href="#a">Plain <code>code</code></a></h2>'),
    "## Plain `code`\n"
  );
  assert.equal(
    await body('<h2><a href="https://example.com/">Linked</a></h2>'),
    "## [Linked](https://example.com/)\n"
  );
});

test("Shiki code blocks keep their language", async () => {
  const markdown = await body(`
    <pre class="astro-code" data-language="css"><code><span class="line"><span>a { color: red; }</span></span>
<span class="line"><span>b { color: blue; }</span></span></code></pre>
    <pre class="astro-code" data-language="plaintext"><code>plain</code></pre>
  `);
  assert.match(
    markdown,
    /^```css\na \{ color: red; \}\nb \{ color: blue; \}\n```$/m
  );
  assert.match(markdown, /^```\nplain\n```$/m);
});

test("a link card becomes one link with its description", async () => {
  const markdown = await body(`
    <a class="rlc-container" href="https://example.com/post">
      <div class="rlc-info">
        <div class="rlc-title">Card title</div>
        <div class="rlc-description">Card description</div>
        <div class="rlc-url-container"><img class="rlc-favicon" src="/remark-link-card/f.png" alt="favicon"><span class="rlc-url">example.com</span></div>
      </div>
      <div class="rlc-image-container"><img class="rlc-image" src="/remark-link-card/og.png" alt="og"></div>
    </a>
  `);
  assert.equal(
    markdown,
    "[Card title](https://example.com/post): Card description\n"
  );
});

test("a post card becomes a list item with a titled link", async () => {
  const markdown = await body(`
    <ul class="stack">
      <li class="blog-post-card">
        <a href="https://blog.sakupi01.com/dev/articles/one/" class="title-container">
          <p class="published">Published on <time datetime="2026-01-02">Jan 2</time></p>
          <h2>Post one</h2>
        </a>
        <p class="excerpt">About one.</p>
        <div><a href="https://blog.sakupi01.com/dev/articles/one/">Read more...</a></div>
      </li>
    </ul>
  `);
  assert.equal(
    markdown,
    "- [Post one](https://blog.sakupi01.com/dev/articles/one/) (2026-01-02 — About one.)\n"
  );
});

test("embeds become links to their source, and empty ones disappear", async () => {
  const markdown = await body(`
    <iframe src="https://www.youtube.com/embed/abc" title="A talk"></iframe>
    <iframe src="https://speakerdeck.com/player/xyz"></iframe>
    <video src="/videos/a.mp4"></video>
    <video><source src="../b.webm"></video>
    <audio src="/sounds/a.mp3"></audio>
    <iframe></iframe>
  `);
  // A link whose text is its own URL is written as an autolink.
  assert.deepEqual(markdown.trim().split("\n\n"), [
    "[A talk](https://www.youtube.com/embed/abc)",
    "<https://speakerdeck.com/player/xyz>",
    "<https://blog.sakupi01.com/videos/a.mp4>",
    "<https://blog.sakupi01.com/dev/articles/b.webm>",
    "<https://blog.sakupi01.com/sounds/a.mp3>",
  ]);
});

test("notes, captions and Baseline widgets convert to plain Markdown", async () => {
  const markdown = await body(`
    <aside class="memo"><p>A note.</p></aside>
    <figure><img src="/_astro/a.webp" alt="Same text"><figcaption>Same text</figcaption></figure>
    <figure><img src="/_astro/b.webp" alt="Alt"><figcaption>A different caption</figcaption></figure>
    <baseline-status featureid="anchor-positioning"></baseline-status>
  `);
  assert.match(markdown, /^> A note\.$/m);
  assert.equal(markdown.match(/Same text/g)?.length, 1);
  assert.match(markdown, /^A different caption$/m);
  assert.match(markdown, /^Baseline: anchor-positioning$/m);
});

test("line breaks are newlines in text and spaces in table cells", async () => {
  assert.equal(await body("<p>one<br>two</p>"), "one\ntwo\n");

  const table = await body(
    "<table><thead><tr><th>h</th></tr></thead><tbody><tr><td>x<br>y</td></tr></tbody></table>"
  );
  assert.match(table, /^\| x y \|$/m);
  assert.doesNotMatch(table, /&#xA;/);
});

test("GFM footnotes become Markdown footnotes", async () => {
  const markdown = await body(`
    <p>Text<sup><a href="#user-content-fn-note" id="user-content-fnref-note" data-footnote-ref>1</a></sup> and 10<sup>2</sup>.</p>
    <section data-footnotes class="footnotes">
      <h2 class="sr-only" id="footnote-label">Footnotes</h2>
      <ol><li id="user-content-fn-note"><p>The note. <a href="#user-content-fnref-note" data-footnote-backref>↩</a></p></li></ol>
    </section>
  `);
  assert.match(markdown, /^Text\[\^note\] and 102\.$/m);
  assert.match(markdown, /^\[\^note\]: The note\.$/m);
  assert.doesNotMatch(markdown, /↩|Footnotes/);
});

test("a footnote label that is not a valid percent escape still converts", async () => {
  const markdown = await body(`
    <p>Half<sup><a href="#user-content-fn-50%of" data-footnote-ref>1</a></sup></p>
    <section data-footnotes><ol><li id="user-content-fn-50%of"><p>Half of it.</p></li></ol></section>
  `);
  assert.ok(markdown.includes("[^50%of]: Half of it."));
});

test("links and images are absolute, fragments stay local", async () => {
  const markdown = await body(`
    <p><a href="/about/">root</a> <a href="../other/">relative</a> <a href="#part">fragment</a> <a href="mailto:a@example.com">mail</a></p>
    <p><img src="/_astro/pic.webp" alt="pic"></p>
  `);
  assert.ok(markdown.includes("[root](https://blog.sakupi01.com/about/)"));
  assert.ok(
    markdown.includes(
      "[relative](https://blog.sakupi01.com/dev/articles/other/)"
    )
  );
  assert.ok(markdown.includes("[fragment](#part)"));
  assert.ok(markdown.includes("[mail](mailto:a@example.com)"));
  assert.ok(
    markdown.includes("![pic](https://blog.sakupi01.com/_astro/pic.webp)")
  );
});

test("a page without <main> or a canonical link is rejected", async () => {
  await assert.rejects(
    htmlToMarkdown("<html><head></head><body><p>x</p></body></html>"),
    /no <main> element/
  );
  await assert.rejects(
    htmlToMarkdown("<html><head></head><body><main>x</main></body></html>"),
    /no canonical link/
  );
});
