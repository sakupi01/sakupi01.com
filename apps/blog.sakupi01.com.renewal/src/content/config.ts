import { defineCollection, reference, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string(),
    tags: z.array(z.string()),
    category: z.enum(["dev", "life"]),
    status: z.enum(["draft", "published"]),
    relatedPosts: z.array(reference("blog")).optional(),
  }),
});

export const collections = {
  blog,
};
