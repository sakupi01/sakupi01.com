import rss, { pagesGlobToRssItems } from "@astrojs/rss";
import type { APIContext } from "astro";
import { marked } from "marked";
import { DESCRIPTION, TITLE } from "../constants/site-config";
import { allBlogPosts } from "../utils/contents";

export async function GET(context: APIContext) {
  const items = await Promise.all(
    allBlogPosts.map(async (post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.excerpt,
      link: `/posts/${post.slug}/`,
      content: await marked.parse(post.body),
    })),
  );
  return rss({
    title: TITLE,
    description: DESCRIPTION,
    site: context.site?.origin ?? "",
    items,
  });
}
