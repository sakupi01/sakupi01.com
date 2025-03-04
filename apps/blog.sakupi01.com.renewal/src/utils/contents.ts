import { getCollection } from "astro:content";

export const allBlogPosts = (await getCollection("blog")).sort((a, b) => {
  return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
});
