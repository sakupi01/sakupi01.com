import type { InferEntrySchema } from "astro:content";
import { housePostUrl } from "../utils/postUrl";
import { identity, site } from "./site";

/** A schema.org document that describes several linked entities at once. */
export interface StructuredDataGraph {
  "@context": "https://schema.org";
  "@graph": Record<string, unknown>[];
}

const personId = "https://sakupi01.com/#person";
const websiteId = `${site.url}/#website`;
const blogId = `${site.url}/#blog`;

const person = {
  "@type": "Person",
  "@id": personId,
  name: site.author,
  url: identity.url,
  email: identity.email,
  jobTitle: "Front-end developer and Design Technologist",
  sameAs: Object.values(identity.profiles),
};

const website = {
  "@type": "WebSite",
  "@id": websiteId,
  name: site.title,
  description: site.description,
  url: `${site.url}/`,
  inLanguage: ["ja-JP", "en"],
  author: { "@id": personId },
  publisher: { "@id": personId },
};

const blog = {
  "@type": "Blog",
  "@id": blogId,
  name: site.title,
  description: site.description,
  url: `${site.url}/`,
  inLanguage: ["ja-JP", "en"],
  author: { "@id": personId },
  publisher: { "@id": personId },
  isPartOf: { "@id": websiteId },
};

/** Returns the identity graph shared by non-article blog pages. */
export function siteStructuredData(): StructuredDataGraph {
  return {
    "@context": "https://schema.org",
    "@graph": [person, website, blog],
  };
}

/** Extends the site identity graph with one article's BlogPosting data. */
export function blogPostStructuredData(
  frontmatter: InferEntrySchema<"blog">,
  slug: string
): StructuredDataGraph {
  const url = housePostUrl(slug);
  return {
    "@context": "https://schema.org",
    "@graph": [
      person,
      website,
      blog,
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: frontmatter.title,
        description: frontmatter.excerpt,
        url,
        mainEntityOfPage: url,
        datePublished: frontmatter.date.toISOString(),
        dateModified: frontmatter.update.toISOString(),
        image: new URL(site.ogImage, site.url).href,
        keywords: frontmatter.tags,
        inLanguage: "ja-JP",
        author: { "@id": personId },
        publisher: { "@id": personId },
        isPartOf: { "@id": blogId },
      },
    ],
  };
}
