import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import he from "he";
import type { Paragraph, Root, Text } from "mdast";
import ogs from "open-graph-scraper";
import sanitize from "sanitize-filename";
import { SKIP, visit } from "unist-util-visit";

const defaultSaveDirectory = "public";
const defaultOutputDirectory = "/remark-link-card/";

interface Options {
  cache?: boolean;
  shortenUrl?: boolean;
}

interface LinkCardData {
  title: string;
  description: string;
  faviconSrc: string;
  ogImageSrc: string;
  ogImageAlt: string;
  displayUrl: string;
  url: string;
}

const getOpenGraph = async (targetUrl: string) => {
  try {
    const { result } = await ogs({ url: targetUrl, timeout: 10000 });
    return result;
  } catch (error: unknown) {
    const err = error as { result?: { requestUrl?: string; error?: string } };
    console.error(
      `[remark-link-card] Error: Failed to get the Open Graph data of ${err.result?.requestUrl} due to ${err.result?.error}.`
    );
    return undefined;
  }
};

const downloadImage = async (
  url: string,
  saveDirectory: string
): Promise<string | undefined> => {
  let targetUrl: URL;
  try {
    targetUrl = new URL(url);
  } catch (error) {
    console.error(
      `[remark-link-card] Error: Failed to parse url "${url}"\n ${error}`
    );
    return undefined;
  }
  const filename = sanitize(decodeURI(targetUrl.href));
  const saveFilePath = path.join(saveDirectory, filename);

  // check file existence
  try {
    await access(saveFilePath);
    return filename;
  } catch {
    // file doesn't exist, continue
  }

  // check directory existence
  try {
    await access(saveDirectory);
  } catch {
    await mkdir(saveDirectory, { recursive: true });
  }

  // fetch data
  try {
    const response = await fetch(targetUrl.href, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
      },
      signal: AbortSignal.timeout(10000),
    });
    const buffer = await response.arrayBuffer();
    await writeFile(saveFilePath, Buffer.from(buffer));
  } catch (error) {
    console.error(
      `[remark-link-card] Error: Failed to download image from ${targetUrl.href}\n ${error}`
    );
    return undefined;
  }

  return filename;
};

const fetchData = async (
  targetUrl: string,
  options?: Options
): Promise<LinkCardData> => {
  const ogResult = await getOpenGraph(targetUrl);
  const parsedUrl = new URL(targetUrl);

  const title =
    (ogResult?.ogTitle && he.encode(ogResult.ogTitle)) || parsedUrl.hostname;
  const description =
    (ogResult?.ogDescription && he.encode(ogResult.ogDescription)) || "";

  // favicon
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}`;
  let faviconSrc = "";
  if (options?.cache) {
    const faviconFilename = await downloadImage(
      faviconUrl,
      path.join(process.cwd(), defaultSaveDirectory, defaultOutputDirectory)
    );
    faviconSrc = faviconFilename
      ? path.join(defaultOutputDirectory, faviconFilename)
      : "";
  } else {
    faviconSrc = faviconUrl;
  }

  // og image
  let ogImageSrc = "";
  const ogImage = ogResult?.ogImage as
    | { url?: string; alt?: string }[]
    | { url?: string; alt?: string }
    | undefined;
  const ogImageUrl = Array.isArray(ogImage) ? ogImage[0]?.url : ogImage?.url;
  if (ogImageUrl) {
    if (options?.cache) {
      const imageFilename = await downloadImage(
        ogImageUrl,
        path.join(process.cwd(), defaultSaveDirectory, defaultOutputDirectory)
      );
      ogImageSrc = imageFilename
        ? path.join(defaultOutputDirectory, imageFilename)
        : "";
    } else {
      ogImageSrc = ogImageUrl;
    }
  }

  const ogImageAltRaw = Array.isArray(ogImage) ? ogImage[0]?.alt : ogImage?.alt;
  const ogImageAlt = (ogImageAltRaw && he.encode(ogImageAltRaw)) || title;

  let displayUrl = options?.shortenUrl ? parsedUrl.hostname : targetUrl;
  try {
    displayUrl = decodeURI(displayUrl);
  } catch (error) {
    console.error(
      `[remark-link-card] Error: Cannot decode url: "${targetUrl}"\n ${error}`
    );
  }

  return {
    title,
    description,
    faviconSrc,
    ogImageSrc,
    ogImageAlt,
    displayUrl,
    url: targetUrl,
  };
};

const createLinkCard = (data: LinkCardData): string => {
  const faviconElement = data.faviconSrc
    ? `<img class="rlc-favicon" src="${data.faviconSrc}" alt="${data.title} favicon" width="16" height="16">`
    : "";

  const descriptionElement = data.description
    ? `<div class="rlc-description">${data.description}</div>`
    : "";

  const imageElement = data.ogImageSrc
    ? `<div class="rlc-image-container">
      <img class="rlc-image" src="${data.ogImageSrc}" alt="${data.ogImageAlt}" />
    </div>`
    : "";

  return `
<a class="rlc-container" href="${data.url}">
  <div class="rlc-info">
    <div class="rlc-title">${data.title}</div>
    ${descriptionElement}
    <div class="rlc-url-container">
      ${faviconElement}
      <span class="rlc-url">${data.displayUrl}</span>
    </div>
  </div>
  ${imageElement}
</a>
`.trim();
};

export const remarkLinkCard = (options?: Options) => {
  return async (tree: Root) => {
    const transformers: (() => Promise<void>)[] = [];

    visit(tree, "paragraph", (paragraphNode: Paragraph, index, parent) => {
      // Skip if inside a list item
      if (parent?.type === "listItem") {
        return SKIP;
      }

      if (paragraphNode.children.length !== 1) {
        return;
      }

      // Skip if data already exists
      if (paragraphNode.data !== undefined) {
        return;
      }

      const child = paragraphNode.children[0];

      // Handle text node with URL
      if (child.type === "text") {
        const textNode = child as Text;
        const urls = textNode.value.match(
          /(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/g
        );
        if (urls && urls.length === 1 && textNode.value.trim() === urls[0]) {
          transformers.push(async () => {
            const data = await fetchData(urls[0], options);
            const linkCardHtml = createLinkCard(data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (tree.children as any).splice(index, 1, {
              type: "html",
              value: linkCardHtml,
            });
          });
        }
      }

      // Handle link node (autolink like <https://...>)
      if (child.type === "link") {
        const url = child.url;
        if (url.match(/^https?:\/\//)) {
          transformers.push(async () => {
            const data = await fetchData(url, options);
            const linkCardHtml = createLinkCard(data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (tree.children as any).splice(index, 1, {
              type: "html",
              value: linkCardHtml,
            });
          });
        }
      }
    });

    try {
      await Promise.all(transformers.map((t) => t()));
    } catch (error) {
      console.error(`[remark-link-card] Error: ${error}`);
    }

    return tree;
  };
};

export default remarkLinkCard;
