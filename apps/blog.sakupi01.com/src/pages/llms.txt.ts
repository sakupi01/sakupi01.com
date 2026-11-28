import type { APIRoute } from "astro";
import { identity, site } from "../data/site";
import { allHouseBlogPosts } from "../utils/contents";
import { housePostUrl } from "../utils/postUrl";

const byDate = [...allHouseBlogPosts].sort(
  (a, b) => b.data.date.getTime() - a.data.date.getTime()
);

function articleLines(category: "dev" | "life"): string {
  return byDate
    .filter((post) => post.data.category === category)
    .map(
      (post) =>
        `- [${post.data.title}](${housePostUrl(post.id)}): ${post.data.excerpt}`
    )
    .join("\n");
}

const body = `# saku's blog

> A personal blog by saku about Web standards, browser UI, CSS, HTML, accessibility, and front-end engineering.

The site publishes personal research and implementation notes. Articles are not substitutes for the specifications and primary sources they cite.

## When to use this site

- Use it to find research-driven explanations of CSS, HTML, OpenUI, browser UI, and the history of Web platform features.
- Use it to find implementation notes, conference reports, and links to primary sources.
- Every page is also available as Markdown: request its URL with \`Accept: text/markdown\`, or append \`index.md\` to the URL.

## When not to use this site

- Do not treat the blog as an official standards body, product API, MCP server, SDK, or CLI.
- Verify normative claims against the linked specification or primary source.
- Do not assume an older article reflects the latest specification without checking its update date.

## Site resources

- [Blog archive](${site.url}/)
- [Sitemap](${site.url}/sitemap-index.xml)
- [RSS feed](${site.url}/feed.xml)
- [JSON feed](${site.url}/blog.json)
- [About](${site.url}/about/)
- [Contact](${site.url}/contact/)
- [Privacy](${identity.url}privacy/)
- [Source repository](https://github.com/${site.githubRepo})
- [Author profile](${identity.url})

## Development articles

${articleLines("dev")}

## Life articles

${articleLines("life")}
`;

export const GET: APIRoute = () =>
  new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
