import { marked } from "marked";
import { allHouseBlogPosts } from "../utils/contents";

export async function GET() {
  const items = await Promise.all(
    allHouseBlogPosts.map(async (post) => ({
      title: post.data.title,
      pubDate: post.data.update,
      description: post.data.excerpt,
      link: `https://blog.sakupi01.com/${post.slug}/`,
      content: await marked.parse(post.body),
      tags: post.data.tags,
    }))
  );
  return new Response(JSON.stringify(items));
}
