// To use twitter's widget.js, you have to wrap by <div></div> to work with @remark-embedder/core.

export const handleHTML = (html: any, info: { url: any; transformer: any }) => {
  const { url, transformer } = info;
  if (
    transformer.name === "@remark-embedder/transformer-oembed" ||
    url.includes("twitter.com")
  ) {
    return `<div style="margin-block-end: var(--gutter-m);">${html}</div>`;
  }
  return html;
};
