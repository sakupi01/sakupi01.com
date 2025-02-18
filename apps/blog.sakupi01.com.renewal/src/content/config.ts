// 1. `astro:content`からユーティリティをインポート
import { defineCollection, reference, z } from "astro:content";
// 2. 各コレクションに`type`と`schema`を定義
const blog = defineCollection({
  type: "content", // v2.5.0以降
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
// 3. コレクションを登録するために、単一の`collections`オブジェクトをエクスポート
//    このキーは、"src/content"のコレクションのディレクトリ名と一致する必要があります。
export const collections = {
  blog,
};
