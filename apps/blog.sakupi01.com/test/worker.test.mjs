import assert from "node:assert/strict";
import { test } from "node:test";
import worker, { prefersMarkdown } from "../src/worker.ts";

const origin = "https://blog.sakupi01.com";
const notFoundHtml = "<!DOCTYPE html><title>Page not found</title>";
const notFoundMarkdown = "# Page not found\n";

/** Stands in for the static assets binding: only `/404.md` exists. */
function assets({ hasMarkdown404 = true } = {}) {
  const requested = [];
  return {
    requested,
    async fetch(input) {
      const url = new URL(
        input instanceof globalThis.Request ? input.url : input
      );
      requested.push(url.pathname);
      if (hasMarkdown404 && url.pathname === "/404.md") {
        return new globalThis.Response(notFoundMarkdown, { status: 200 });
      }
      return new globalThis.Response(notFoundHtml, {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    },
  };
}

function request(path, headers = {}, method = "GET") {
  return new globalThis.Request(new URL(path, origin), { headers, method });
}

async function assertMarkdown404(response, expectedBody = notFoundMarkdown) {
  assert.equal(response.status, 404);
  assert.equal(
    response.headers.get("content-type"),
    "text/markdown; charset=utf-8"
  );
  assert.equal(
    response.headers.get("content-signal"),
    "ai-train=no, search=yes, ai-input=yes"
  );
  assert.equal(response.headers.get("vary"), "Accept, Accept-Encoding");
  assert.equal(response.headers.get("x-robots-tag"), "noindex");
  assert.ok(response.headers.has("strict-transport-security"));
  assert.equal(await response.text(), expectedBody);
}

test("media types are compared by name and quality, ignoring wildcards", () => {
  assert.equal(prefersMarkdown("text/markdown"), true);
  assert.equal(prefersMarkdown("text/markdown, text/html;q=0.9"), true);
  assert.equal(prefersMarkdown("TEXT/Markdown; q=0.8, text/html;q=0.8"), true);
  assert.equal(prefersMarkdown("text/markdown;q=0.5, */*;q=0.8"), true);
  assert.equal(prefersMarkdown("text/html, text/markdown;q=0.5"), false);
  assert.equal(prefersMarkdown("text/markdown;q=0"), false);
  assert.equal(prefersMarkdown("text/html,application/xhtml+xml"), false);
  assert.equal(prefersMarkdown("*/*"), false);
  assert.equal(prefersMarkdown(""), false);
  assert.equal(prefersMarkdown(null), false);
});

test("a client that prefers Markdown gets the Markdown 404", async () => {
  const response = await worker.fetch(
    request("/missing", { Accept: "text/markdown" }),
    { ASSETS: assets() }
  );
  await assertMarkdown404(response);
});

test("HEAD gets the same headers without a body", async () => {
  const response = await worker.fetch(
    request("/missing", { Accept: "text/markdown" }, "HEAD"),
    { ASSETS: assets() }
  );
  await assertMarkdown404(response, "");
});

test("a missing .md path is a Markdown 404 whatever the Accept header says", async () => {
  for (const headers of [
    {},
    { Accept: "text/html" },
    { Accept: "text/markdown;q=0" },
  ]) {
    const response = await worker.fetch(request("/removed/index.md", headers), {
      ASSETS: assets(),
    });
    await assertMarkdown404(response);
  }
});

test("other clients get the static 404 page untouched", async () => {
  for (const headers of [
    {},
    { Accept: "text/html" },
    { Accept: "text/html, text/markdown;q=0.5" },
  ]) {
    const binding = assets();
    const response = await worker.fetch(request("/missing", headers), {
      ASSETS: binding,
    });

    assert.equal(response.status, 404);
    assert.match(response.headers.get("content-type"), /^text\/html/);
    assert.equal(await response.text(), notFoundHtml);
    assert.deepEqual(binding.requested, ["/missing"]);
  }
});

test("without a built 404.md the HTML 404 is returned", async () => {
  const binding = assets({ hasMarkdown404: false });
  const response = await worker.fetch(
    request("/missing", { Accept: "text/markdown" }),
    { ASSETS: binding }
  );

  assert.equal(response.status, 404);
  assert.equal(await response.text(), notFoundHtml);
  assert.deepEqual(binding.requested, ["/404.md", "/missing"]);
});
