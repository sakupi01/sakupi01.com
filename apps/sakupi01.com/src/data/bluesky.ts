import {
  AppBskyEmbedExternal,
  AppBskyEmbedImages,
  AppBskyEmbedRecord,
  AppBskyEmbedRecordWithMedia,
  AppBskyEmbedVideo,
  AppBskyFeedDefs,
  AppBskyFeedPost,
  AtpAgent,
  RichText,
} from "@atproto/api";

export interface BlueskyPostSegment {
  type: "text" | "link" | "mention" | "tag";
  text: string;
  href?: string;
}

export interface BlueskyImage {
  type: "image";
  thumb: string;
  fullsize: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface BlueskyExternal {
  type: "external";
  uri: string;
  title: string;
  description: string;
  thumb?: string;
}

export interface BlueskyVideo {
  type: "video";
  thumbnail?: string;
  alt?: string;
}

export type BlueskyMedia = BlueskyImage | BlueskyExternal | BlueskyVideo;

export interface BlueskyPost {
  uri: string;
  url: string;
  segments: BlueskyPostSegment[];
  createdAt: string;
  likes: number;
  reposts: number;
  replies: number;
  media: BlueskyMedia[];
}

const BLUESKY_SERVICE = "https://bsky.social";
const BLUESKY_HANDLE = "sakupi01.com";
const FEED_PAGE_LIMIT = 100;

function safeHttpUrl(uri: string): string | undefined {
  try {
    const url = new URL(uri);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.href;
    }
  } catch {
    // not an absolute URL; treated as plain text below
  }
  return undefined;
}

function toSegments(richText: RichText): BlueskyPostSegment[] {
  const segments: BlueskyPostSegment[] = [];

  for (const segment of richText.segments()) {
    if (segment.isLink() && segment.link) {
      const href = safeHttpUrl(segment.link.uri);
      segments.push(
        href
          ? { type: "link", text: segment.text, href }
          : { type: "text", text: segment.text }
      );
    } else if (segment.isMention() && segment.mention) {
      segments.push({
        type: "mention",
        text: segment.text,
        href: `https://bsky.app/profile/${segment.mention.did}`,
      });
    } else if (segment.isTag() && segment.tag) {
      segments.push({
        type: "tag",
        text: segment.text,
        href: `https://bsky.app/hashtag/${encodeURIComponent(segment.tag.tag)}`,
      });
    } else {
      segments.push({ type: "text", text: segment.text });
    }
  }

  return segments;
}

function toMedia(embed: AppBskyFeedDefs.PostView["embed"]): BlueskyMedia[] {
  if (AppBskyEmbedImages.isView(embed)) {
    return embed.images.map((image) => ({
      type: "image" as const,
      thumb: image.thumb,
      fullsize: image.fullsize,
      alt: image.alt,
      width: image.aspectRatio?.width,
      height: image.aspectRatio?.height,
    }));
  }

  if (AppBskyEmbedExternal.isView(embed)) {
    // The card is rendered as a link, so a URI that is not http(s), such as
    // `javascript:`, must not reach the href. The post text is still shown.
    const uri = safeHttpUrl(embed.external.uri);
    if (!uri) return [];
    return [
      {
        type: "external",
        uri,
        title: embed.external.title,
        description: embed.external.description,
        thumb: embed.external.thumb,
      },
    ];
  }

  if (AppBskyEmbedVideo.isView(embed)) {
    return [
      {
        type: "video",
        thumbnail: embed.thumbnail,
        alt: embed.alt,
      },
    ];
  }

  return [];
}

function toBlueskyPost(post: AppBskyFeedDefs.PostView): BlueskyPost | null {
  if (!AppBskyFeedPost.isRecord(post.record)) return null;

  const validation = AppBskyFeedPost.validateRecord(post.record);
  if (!validation.success) return null;
  const record = validation.value;

  const rkey = post.uri.split("/").pop();
  if (!rkey) return null;

  const richText = new RichText({
    text: record.text,
    facets: record.facets,
  });

  return {
    uri: post.uri,
    url: `https://bsky.app/profile/${BLUESKY_HANDLE}/post/${rkey}`,
    segments: toSegments(richText),
    createdAt: record.createdAt,
    likes: post.likeCount ?? 0,
    reposts: post.repostCount ?? 0,
    replies: post.replyCount ?? 0,
    media: toMedia(post.embed),
  };
}

function isOriginalPost(item: AppBskyFeedDefs.FeedViewPost): boolean {
  if (AppBskyFeedDefs.isReasonRepost(item.reason)) return false;

  const embed = item.post.embed;
  return (
    !AppBskyEmbedRecord.isView(embed) &&
    !AppBskyEmbedRecordWithMedia.isView(embed)
  );
}

export async function fetchAllBlueskyPosts(): Promise<BlueskyPost[]> {
  const password = import.meta.env.BLUESKY_APP_PASSWORD;

  if (!password) {
    console.warn(
      "BLUESKY_APP_PASSWORD is not set. Skipping Bluesky feed fetch."
    );
    return [];
  }

  try {
    const agent = new AtpAgent({ service: BLUESKY_SERVICE });
    await agent.login({ identifier: BLUESKY_HANDLE, password });

    const items: AppBskyFeedDefs.FeedViewPost[] = [];
    let cursor: string | undefined;

    do {
      const response = await agent.getAuthorFeed({
        actor: BLUESKY_HANDLE,
        limit: FEED_PAGE_LIMIT,
        cursor,
      });
      items.push(...response.data.feed);
      cursor = response.data.cursor;
    } while (cursor);

    const posts = items
      .filter(isOriginalPost)
      .map((item) => toBlueskyPost(item.post))
      .filter((post): post is BlueskyPost => post !== null);

    console.log(`Fetched ${posts.length} Bluesky posts`); // keep-console
    return posts;
  } catch (error) {
    console.error("Error fetching Bluesky feed:", error);
    return [];
  }
}

export function formatPostDate(dateStr: string): string {
  const date = new Date(dateStr);

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
