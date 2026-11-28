export const profile = {
  author: "saku",
  description:
    "The personal website of saku. A Front-end developer, Design Technologist, and an enthusiast of all things about Web & UI",
  keywords: "web,ui,css,html,technology,programming,browser,saku",
  ogImage: "/cherry-blossom.png",
  twitterHandle: "@sakupi01",
} as const;

/** Canonical production origins, without a trailing slash. */
export const origins = {
  home: "https://sakupi01.com",
  blog: "https://blog.sakupi01.com",
  slides: "https://sakupi01.github.io/slides",
  studio: "https://studio.sakupi01.com",
  colophon: "https://sakupi01.github.io/sakupi01.com",
} as const;

export const repository = {
  name: "sakupi01/sakupi01.com",
  url: "https://github.com/sakupi01/sakupi01.com",
} as const;

export const bugReportHref = `${repository.url}/pulls/new?template=bug_report.md&title=%5BBug%5D+Broken+page`;

export const emailHref =
  "mailto:saku@email.sakupi01.com?subject=Hi%20There!&body=Hi%20saku!%20I%20was%20looking%20at%20your%20blog%20and...";

/** On The Web and the footer Social section. */
export const socialLinks = [
  { label: "X", href: "https://x.com/sakupi01/" },
  { label: "Bluesky", href: "https://bsky.app/profile/sakupi01.com/" },
  { label: "GitHub", href: "https://github.com/sakupi01/" },
  { label: "Codepen", href: "https://codepen.io/sakupi01/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sakupi01/" },
  { label: "Email", href: emailHref },
] as const;
