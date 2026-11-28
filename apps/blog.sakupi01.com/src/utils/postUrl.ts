import { site } from "../data/site";

interface PostLike {
  id: string;
  data: { tags: string | string[] };
}

/**
 * Canonical URL of a post published on this site. The trailing slash is the
 * form the host serves without a redirect.
 */
export function housePostUrl(id: string): string {
  return new URL(`${id}/`, `${site.url}/`).href;
}

/**
 * Public URL of a post in a list that mixes this site's posts with Zenn's.
 * Zenn posts keep the absolute path returned by the Zenn API.
 */
export function postUrl(post: PostLike): string {
  if (post.data.tags.includes("zenn")) {
    return new URL(post.id, import.meta.env.PUBLIC_ZENN_BASE_URL).href;
  }
  return housePostUrl(post.id);
}
