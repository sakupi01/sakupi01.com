// To use twitter's widget.js, you have to wrap by <div></div> to work with @remark-embedder/core.

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const handleHTML = (html: any, info: { url: any; transformer: any }) => {
  const { url, transformer } = info;
  if (
    transformer.name === "@remark-embedder/transformer-oembed" ||
    url.includes("twitter.com")
  ) {
    return `<div style="max-width: max-content; margin-left: auto; margin-right: auto">${html}</div>`;
  }
  return html;
};
