import { z } from "zod";
const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  name: z.string(),
  avatar_small_url: z.string(),
});

const PublicationSchema = z.object({
  id: z.number(),
  name: z.string(),
  display_name: z.string(),
  avatar_small_url: z.string(),
  pro: z.boolean(),
  avatar_registered: z.boolean(),
});

export const ZennArticleSchema = z.object({
  id: z.number(),
  post_type: z.string(),
  title: z.string(),
  slug: z.string(),
  comments_count: z.number(),
  liked_count: z.number(),
  body_letters_count: z.number(),
  article_type: z.union([z.literal("tech"), z.literal("idea")]),
  emoji: z.string(),
  is_suspending_private: z.boolean(),
  published_at: z.string(),
  body_updated_at: z.string(),
  source_repo_updated_at: z.nullable(z.string()),
  pinned: z.boolean(),
  path: z.string(),
  user: UserSchema,
  publication: z.nullable(PublicationSchema),
});

export const ZennArticleObjSchema = z.object({
  articles: z.array(ZennArticleSchema),
  next_page: z.null(),
});

export type ZennArticleType = z.infer<typeof ZennArticleSchema>;
