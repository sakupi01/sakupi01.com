import { defineCollection, reference, z } from "astro:content";
import { blogLoader } from "./loaders/blogLoader";

const blog = defineCollection({
  loader: blogLoader({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    update: z.date(),
    excerpt: z.string(),
    tags: z.array(z.string()),
    category: z.enum(["dev", "life"]),
    status: z.enum(["draft", "published"]),
    relatedPosts: z.array(reference("blog")).optional(),
    blueskyPostUrl: z.string().url().optional(),
  }),
});

export const collections = {
  blog,
};
