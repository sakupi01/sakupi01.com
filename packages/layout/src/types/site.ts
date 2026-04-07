export interface SiteConfig {
  title: string;
  description: string;
  url: string;
  author: string;
  keywords: string;
  ogImage: string;
  twitterHandle: string;
}

export interface BlogSiteConfig extends SiteConfig {
  githubRepo: string;
}
