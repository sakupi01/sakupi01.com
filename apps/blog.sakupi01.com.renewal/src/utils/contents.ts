import { getCollection } from "astro:content";

export const allBlogPosts = await getCollection("blog");
