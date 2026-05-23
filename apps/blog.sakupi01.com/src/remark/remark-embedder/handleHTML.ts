// To use twitter's widget.js, you have to wrap by <div></div> to work with @remark-embedder/core.

const getEmbedClass = (url: string): string => {
  const host = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  })();

  if (host.endsWith("youtube.com") || host === "youtu.be") {
    return "remark-embed remark-embed--youtube";
  }
  if (host === "x.com" || host.endsWith("twitter.com")) {
    return "remark-embed remark-embed--x";
  }
  return "remark-embed";
};

export const handleHTML = (
  html: string,
  info: { url: string; transformer: { name: string } }
) => {
  const { url, transformer } = info;
  if (
    transformer.name === "@remark-embedder/transformer-oembed" ||
    url.includes("twitter.com") ||
    url.includes("x.com")
  ) {
    return `<div class="${getEmbedClass(url)}">${html}</div>`;
  }
  return html;
};
