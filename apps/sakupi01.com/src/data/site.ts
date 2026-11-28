import { origins, profile, type SiteConfig } from "@sakupi01/layout";

export const site: SiteConfig = {
  title: "@sakupi01.com",
  description: profile.description,
  url: origins.home,
  author: profile.author,
  keywords: profile.keywords,
  ogImage: profile.ogImage,
  twitterHandle: profile.twitterHandle,
};
