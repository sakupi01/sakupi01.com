import {
  origins,
  profile,
  repository,
  type BlogSiteConfig,
} from "@sakupi01/layout";

export const site: BlogSiteConfig = {
  title: "saku's blog | @sakupi01.com",
  description: profile.description,
  url: origins.blog,
  author: profile.author,
  keywords: profile.keywords,
  ogImage: profile.ogImage,
  twitterHandle: profile.twitterHandle,
  githubRepo: repository.name,
};
