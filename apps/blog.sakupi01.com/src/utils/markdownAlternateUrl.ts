import { site } from "../data/site";

/** URL of the Markdown file that the build writes next to a page's HTML. */
export function markdownAlternateUrl(pathname: string): string {
  const directory = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return new URL(`${directory}index.md`, site.url).href;
}
