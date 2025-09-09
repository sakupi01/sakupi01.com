import { getCollection } from "astro:content";
import { ZennArticleObjSchema } from "../schema";
import { assertNonNullable } from "./assertNonNullable";

async function fetchZennData() {
  const zennUrl = import.meta.env.ZENN_URL;
  assertNonNullable(zennUrl);
  const res = await fetch(zennUrl);
  return ZennArticleObjSchema.parse(await res.json());
}

export const zennArticles = async () => {
  const zennData = await fetchZennData();
  return zennData.articles.map((entry) => {
    return {
      slug: entry.path,
      data: {
        title: entry.title,
        date: new Date(entry.published_at),
        excerpt: "Blog written on Zenn",
        tags: "zenn",
        category: "dev",
        status: "published",
      },
    };
  });
};

export const allHouseBlogPosts = (await getCollection("blog")).filter(
  (entry) => entry.data.status === "published",
);

const allHouseTechBlogPosts = (await getCollection("blog")).filter(
  (entry) => entry.slug.startsWith("dev") && entry.data.status === "published",
);

const allHouseLifeBlogPosts = (await getCollection("blog")).filter(
  (entry) => entry.slug.startsWith("life") && entry.data.status === "published",
);

export const allTechPosts = await Promise.all([
  ...(await zennArticles()),
  ...allHouseTechBlogPosts,
]).then((posts) =>
  posts.sort((a, b) => {
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  }),
);

export const allLifePosts = await Promise.all([...allHouseLifeBlogPosts]).then(
  (posts) =>
    posts.sort((a, b) => {
      return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
    }),
);

export const allPosts = await Promise.all([
  ...(await zennArticles()),
  ...allHouseBlogPosts,
]).then((posts) =>
  posts.sort((a, b) => {
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  }),
);
