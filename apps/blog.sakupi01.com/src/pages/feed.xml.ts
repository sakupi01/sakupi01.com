import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { marked } from "marked";
import { DESCRIPTION, TITLE } from "../constants/site-config";
import { allHouseBlogPosts } from "../utils/contents";

export async function GET(context: APIContext) {
  const items = await Promise.all(
    allHouseBlogPosts.map(async (post) => ({
      title: post.data.title,
      pubDate: post.data.update,
      description: post.data.excerpt,
      link: `/${post.slug}/`,
      content: await marked.parse(post.body),
    }))
  );
  return rss({
    title: TITLE,
    description: DESCRIPTION,
    site: context.site?.origin ?? "",
    items,
  });
}
