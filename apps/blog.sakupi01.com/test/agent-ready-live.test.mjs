import assert from "node:assert/strict";
import http from "node:http";
import https from "node:https";
import { test } from "node:test";

/**
 * local      wrangler dev on this machine
 * preview    the workers.dev deployment (outside the zone, so no rewrite rule)
 * rehearsal  a temporary hostname in the sakupi01.com zone, before cutover
 * production https://blog.sakupi01.com only
 */
const modes = new Set(["local", "preview", "rehearsal", "production"]);
const mode = process.env.AGENT_READY_MODE;
assert.ok(
  modes.has(mode),
  "Set AGENT_READY_MODE to local, preview, rehearsal, or production."
);

const base = new URL(
  process.env.AGENT_READY_BASE_URL ?? "http://127.0.0.1:8787"
);
const expectsCloudflare = mode !== "local";
// The zone's URL Rewrite Rule is what maps `Accept: text/markdown` onto the
// Markdown files, so same-URL negotiation exists only on zone hostnames.
const rewriteActive = mode === "rehearsal" || mode === "production";
const canonicalOrigin = "https://blog.sakupi01.com";
const contentSignal = "ai-train=no, search=yes, ai-input=yes";
const article = "/dev/articles/organizing-fec-f-2026/";
const requestTimeoutMs = 15_000;
const testTimeoutMs = 60_000;

// Each mode skips checks the others make, so a mode must not run against a
// host it was not written for.
if (mode === "local") {
  assert.ok(
    ["127.0.0.1", "localhost", "[::1]"].includes(base.hostname),
    "Local mode only verifies a server on this machine."
  );
}
if (mode === "production") {
  assert.equal(
    base.origin,
    canonicalOrigin,
    "Production mode only verifies the canonical production origin."
  );
}
if (mode === "rehearsal") {
  assert.ok(
    base.protocol === "https:" && base.hostname.endsWith(".sakupi01.com"),
    "Rehearsal mode needs an https hostname in the sakupi01.com zone."
  );
}

function request(path, accept, options = {}) {
  return fetch(new URL(path, base), {
    redirect: "manual",
    headers: accept ? { Accept: accept } : undefined,
    signal: globalThis.AbortSignal.timeout(requestTimeoutMs),
    ...options,
  });
}

/** `fetch` overwrites Sec-Fetch-* headers, so navigations need a raw request. */
function navigate(path, accept) {
  const client = base.protocol === "https:" ? https : http;
  return new Promise((resolve, reject) => {
    const outgoing = client.get(
      new URL(path, base),
      {
        headers: { Accept: accept, "Sec-Fetch-Mode": "navigate" },
        timeout: requestTimeoutMs,
      },
      (incoming) => {
        const chunks = [];
        incoming.on("data", (chunk) => chunks.push(chunk));
        incoming.on("end", () =>
          resolve({
            status: incoming.statusCode,
            contentType: incoming.headers["content-type"] ?? "",
            body: globalThis.Buffer.concat(chunks).toString("utf8"),
          })
        );
      }
    );
    outgoing.on("timeout", () => outgoing.destroy(new Error("timed out")));
    outgoing.on("error", reject);
  });
}

function assertSharedHeaders(response) {
  const vary = (response.headers.get("vary") ?? "")
    .split(",")
    .map((field) => field.trim().toLowerCase());

  assert.equal(response.headers.get("content-signal"), contentSignal);
  assert.ok(vary.includes("accept"), `Vary: ${vary}`);
  assert.ok(vary.includes("accept-encoding"), `Vary: ${vary}`);
  assert.match(
    response.headers.get("strict-transport-security") ?? "",
    /^max-age=\d+/
  );
  if (expectsCloudflare) {
    assert.match(response.headers.get("server") ?? "", /cloudflare/i);
    assert.equal(response.headers.has("x-vercel-id"), false);
  }
}

function assertHtml(response, status) {
  assert.equal(response.status, status);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html/);
  assertSharedHeaders(response);
}

function assertMarkdown(response, status) {
  assert.equal(response.status, status);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/markdown;\s*charset=utf-8$/i
  );
  assertSharedHeaders(response);
}

/** An existing page as Markdown: indexable through its HTML URL only. */
function assertMarkdownPage(response, pagePath) {
  assertMarkdown(response, 200);
  assert.equal(response.headers.has("x-robots-tag"), false);
  assert.ok(
    (response.headers.get("link") ?? "").includes(
      `<${canonicalOrigin}${pagePath}>; rel="canonical"`
    ),
    `Link: ${response.headers.get("link")}`
  );
}

async function assertMarkdown404(response) {
  assertMarkdown(response, 404);
  assert.equal(response.headers.get("x-robots-tag"), "noindex");

  assertMarkdownBody(await response.text(), /llms\.txt/);
}

function assertMarkdownBody(body, expected) {
  assert.ok(body.length > 20);
  assert.match(body, expected);
  assert.doesNotMatch(body, /<!doctype|<html|<body/i);
}

test(
  "public machine-readable resources are available",
  { timeout: testTimeoutMs },
  async () => {
    const expectations = [
      ["/llms.txt", /^text\/plain;\s*charset=utf-8$/i],
      ["/robots.txt", /^text\/plain/],
      ["/sitemap-index.xml", /^application\/xml/],
      ["/feed.xml", /^application\/(?:rss\+)?xml/],
      ["/blog.json", /^application\/json/],
    ];

    for (const [path, contentTypePattern] of expectations) {
      const response = await request(path);
      assert.equal(response.status, 200, path);
      assert.match(
        response.headers.get("content-type") ?? "",
        contentTypePattern,
        path
      );
      assert.ok((await response.text()).length > 20, path);
    }
  }
);

test(
  "feeds can be read from pages on other origins",
  { timeout: testTimeoutMs },
  async () => {
    for (const path of ["/blog.json", "/feed.xml"]) {
      const response = await request(path, undefined, {
        headers: { Origin: "https://example.com" },
      });
      assert.equal(
        response.headers.get("access-control-allow-origin"),
        "*",
        path
      );
    }
  }
);

test(
  "the tag URL that changed case redirects to the unified tag",
  { timeout: testTimeoutMs },
  async () => {
    for (const path of ["/tags/CSS", "/tags/CSS/"]) {
      const response = await request(path);
      assert.equal(response.status, 301, path);
      assert.equal(
        new URL(response.headers.get("location") ?? "", base).pathname,
        "/tags/css/",
        path
      );
    }
  }
);

test(
  "homepage advertises real discovery resources and content policy",
  { timeout: testTimeoutMs },
  async () => {
    const response = await request("/", "text/html");
    const link = response.headers.get("link") ?? "";

    assertHtml(response, 200);
    assert.match(link, /<\/llms\.txt>; rel="describedby"/);
    assert.match(link, /<\/index\.md>; rel="alternate"/);
    assert.match(link, /<\/feed\.xml>; rel="alternate"/);
    assert.doesNotMatch(link, /rel="sitemap"/);
  }
);

test(
  "HTML pages and the custom 404 keep their browser behavior",
  { timeout: testTimeoutMs },
  async () => {
    for (const path of ["/", "/about/", "/contact/", article]) {
      const response = await request(path, "text/html");
      assertHtml(response, 200);
      assert.match(
        response.headers.get("content-type") ?? "",
        /^text\/html;\s*charset=utf-8$/i,
        path
      );
      assert.match(await response.text(), /<!DOCTYPE html>/i);
    }

    const notFound = await request("/__agent-ready-404-probe", "text/html");
    assertHtml(notFound, 404);
    assert.match(await notFound.text(), /Page not found/);
  }
);

test(
  "every page has a Markdown file at a stable URL",
  { timeout: testTimeoutMs },
  async () => {
    const cases = [
      ["/", /^# Archive/m],
      ["/about/", /^# About$/m],
      [article, /Frontend Conference Fukuoka 2026/],
    ];

    for (const [pagePath, expected] of cases) {
      const response = await request(`${pagePath}index.md`);
      assertMarkdownPage(response, pagePath);

      const body = await response.text();
      assert.match(body, /^---\ntitle: "/, pagePath);
      assertMarkdownBody(body, expected);
    }
  }
);

test(
  "a missing page is a Markdown 404 only for clients that prefer Markdown",
  { timeout: testTimeoutMs },
  async () => {
    const probe = "/__agent-ready-markdown-404-probe";

    await assertMarkdown404(await request(probe, "text/markdown"));

    const head = await request(probe, "text/markdown", { method: "HEAD" });
    assertMarkdown(head, 404);
    assert.equal(await head.text(), "");

    for (const accept of [
      undefined,
      "text/html",
      "text/markdown;q=0",
      "text/html, text/markdown;q=0.5",
    ]) {
      const html = await request(probe, accept);
      assertHtml(html, 404);
      assert.match(await html.text(), /Page not found/, String(accept));
    }
  }
);

test(
  "a missing Markdown file is a Markdown 404 for every non-browser client",
  { timeout: testTimeoutMs },
  async () => {
    // `_headers` labels every `.md` path as Markdown, so the body has to be
    // Markdown too, whatever the Accept header says.
    for (const accept of [undefined, "text/html", "text/markdown;q=0"]) {
      await assertMarkdown404(
        await request("/__agent-ready-missing/index.md", accept)
      );
    }
  }
);

test(
  "browser navigations to a missing page get the HTML 404",
  { timeout: testTimeoutMs },
  async () => {
    const response = await navigate(
      "/__agent-ready-navigation-404-probe",
      "text/html,application/xhtml+xml,*/*;q=0.8"
    );
    assert.equal(response.status, 404);
    assert.match(response.contentType, /^text\/html/);
    assert.match(response.body, /Page not found/);
  }
);

test(
  "the same URL negotiates HTML and Markdown",
  { skip: !rewriteActive, timeout: testTimeoutMs },
  async () => {
    const cases = [
      ["/", /^# Archive/m],
      ["/about/", /^# About$/m],
      [article, /Frontend Conference Fukuoka 2026/],
    ];

    for (const [path, expected] of cases) {
      const htmlBefore = await request(path, "text/html");
      const markdown = await request(path, "text/markdown");
      const htmlAfter = await request(path, "text/html");
      const file = await request(`${path}index.md`);

      for (const html of [htmlBefore, htmlAfter]) {
        assertHtml(html, 200);
        assert.match(await html.text(), /<!DOCTYPE html>/i);
      }
      assertMarkdownPage(markdown, path);

      const body = await markdown.text();
      assertMarkdownBody(body, expected);
      assert.equal(body, await file.text(), `${path} differs from index.md`);
    }

    // Media types are case-insensitive; the rule lower-cases the header.
    assertMarkdownPage(await request("/about/", "TEXT/MARKDOWN"), "/about/");

    // Paths without a trailing slash are not rewritten, so feeds stay as is.
    const feed = await request("/feed.xml", "text/markdown");
    assert.equal(feed.status, 200);
    assert.match(feed.headers.get("content-type") ?? "", /xml/);

    // The rule matches on a substring, so a missing page is rewritten to a
    // missing Markdown file even when the client ranks Markdown at zero.
    for (const accept of ["text/markdown", "text/markdown;q=0"]) {
      await assertMarkdown404(
        await request("/__agent-ready-negotiated-404-probe/", accept)
      );
    }
  }
);
