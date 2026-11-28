import type { BlogSiteConfig } from "@sakupi01/layout";

export const site: BlogSiteConfig = {
  title: "saku's blog | @sakupi01.com",
  description:
    "The personal website of saku. A Front-end developer, Design Technologist, and an enthusiast of all things about Web & UI",
  url: "https://blog.sakupi01.com",
  author: "saku",
  keywords: "web,ui,css,html,technology,programming,browser,saku",
  ogImage: "/cherry-blossom.png",
  twitterHandle: "@sakupi01",
  githubRepo: "sakupi01/sakupi01.com",
};

export const identity = {
  url: "https://sakupi01.com/",
  email: "mailto:saku@email.sakupi01.com",
  profiles: {
    github: "https://github.com/sakupi01",
    bluesky: "https://bsky.app/profile/sakupi01.com",
    x: "https://x.com/sakupi01",
    codepen: "https://codepen.io/sakupi01",
  },
} as const;
