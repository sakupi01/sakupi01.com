/**
 * Runs only for requests that match no static asset. Existing pages, their
 * Markdown siblings, feeds and images are served straight from static assets
 * and never reach this code, so traffic to them costs no Worker invocation.
 *
 * `_headers` does not apply to responses built here, so the Markdown 404 sets
 * its own headers.
 */
interface Env {
  ASSETS: { fetch(input: Request | URL): Promise<Response> };
}

/** Must stay equal to the value in public/_headers and public/robots.txt. */
const CONTENT_SIGNAL = "ai-train=no, search=yes, ai-input=yes";
const NOT_FOUND_MARKDOWN = "/404.md";

function quality(parameters: string[]): number {
  const q = parameters
    .map((parameter) => parameter.trim().toLowerCase())
    .find((parameter) => parameter.startsWith("q="));
  if (q === undefined) return 1;
  const value = Number(q.slice(2));
  return Number.isNaN(value) ? 0 : value;
}

/**
 * True when the Accept header names `text/markdown` and ranks it at least as
 * high as `text/html`. Wildcard ranges do not count, so browsers and generic
 * HTTP clients keep getting HTML.
 */
export function prefersMarkdown(accept: string | null): boolean {
  if (accept === null) return false;

  const qualities = new Map<string, number>();
  for (const range of accept.split(",")) {
    const [type = "", ...parameters] = range.split(";");
    qualities.set(type.trim().toLowerCase(), quality(parameters));
  }
  const markdown = qualities.get("text/markdown") ?? 0;
  return markdown > 0 && markdown >= (qualities.get("text/html") ?? 0);
}

/**
 * A path ending in `.md` names a Markdown file, whatever the Accept header
 * says. It also covers requests that the zone's rewrite rule turned into
 * `…/index.md`: `_headers` labels every `.md` path as Markdown, so an HTML
 * body there would contradict its own Content-Type.
 */
function wantsMarkdown(request: Request): boolean {
  return (
    new URL(request.url).pathname.endsWith(".md") ||
    prefersMarkdown(request.headers.get("Accept"))
  );
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (!wantsMarkdown(request)) {
      return env.ASSETS.fetch(request);
    }

    const notFound = await env.ASSETS.fetch(
      new URL(NOT_FOUND_MARKDOWN, request.url)
    );
    if (!notFound.ok) {
      // Without the Markdown page, the HTML 404 is still a truthful answer.
      return env.ASSETS.fetch(request);
    }
    return new Response(request.method === "HEAD" ? null : notFound.body, {
      status: 404,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Signal": CONTENT_SIGNAL,
        "Strict-Transport-Security": "max-age=63072000",
        Vary: "Accept, Accept-Encoding",
        "X-Robots-Tag": "noindex",
      },
    });
  },
};
