import { JSDOM } from "jsdom";

export interface SlideItem {
  title: string;
  url: string;
  pubDate: string;
  description?: string;
  author?: string;
  thumbnail?: string;
  tags: string[];
}

const SLIDES_RSS_URL = "https://sakupi01.github.io/slides/rss.xml";
const EXCLUDED_CATEGORIES = ["ja", "en"];

function getElementText(element: Element | null): string {
  if (!element) return "";
  return element.textContent || "";
}

function getChildElementsByTagName(node: Node, tagName: string): Element[] {
  const result: Element[] = [];

  if (node?.childNodes) {
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i] as Element;
      if (child.nodeName === tagName) {
        result.push(child);
      }
    }
  }

  return result;
}

function parseSlideItem(item: Element): SlideItem {
  const title = getElementText(item.getElementsByTagName("title")[0]);
  const link = getElementText(item.getElementsByTagName("link")[0]);
  const pubDate = getElementText(item.getElementsByTagName("pubDate")[0]);
  const description = getElementText(
    item.getElementsByTagName("description")[0]
  );

  const dcCreatorElements = getChildElementsByTagName(item, "dc:creator");
  const author =
    dcCreatorElements.length > 0 ? getElementText(dcCreatorElements[0]) : "";

  const mediaContentElements = getChildElementsByTagName(item, "media:content");
  const thumbnail =
    mediaContentElements.length > 0
      ? mediaContentElements[0].getAttribute("url") || ""
      : "";

  const categoryElements = item.getElementsByTagName("category");
  const tags: string[] = [];

  for (let j = 0; j < categoryElements.length; j++) {
    const category = getElementText(categoryElements[j]);
    if (category && !EXCLUDED_CATEGORIES.includes(category)) {
      tags.push(category);
    }
  }

  return {
    title: title || "Untitled Slide",
    url: link,
    pubDate,
    description,
    author,
    thumbnail,
    tags,
  };
}

export async function fetchSlides(): Promise<SlideItem[]> {
  try {
    const response = await fetch(SLIDES_RSS_URL);
    const xmlText = await response.text();

    const jsdom = new JSDOM();
    const parser = new jsdom.window.DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    const items = xmlDoc.getElementsByTagName("item");
    const slides: SlideItem[] = [];

    for (let i = 0; i < items.length; i++) {
      slides.push(parseSlideItem(items[i]));
    }

    return slides;
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    return [];
  }
}

export function formatRFC2822Date(dateStr: string): string {
  const date = new Date(dateStr);

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
