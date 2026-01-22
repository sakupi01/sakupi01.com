import mdx from "@astrojs/mdx";
import remarkEmbedder from "@remark-embedder/core";
import oembedTransformer from "@remark-embedder/transformer-oembed";
import { defineConfig } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkBreaks from "remark-breaks";
// @ts-expect-error wip
import collapse from "remark-collapse";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import { customClassName } from "./src/remark/customClassName";
import {
  cacheSave,
  cache as remarkEmbedderCache,
} from "./src/remark/remark-embedder/cache";
import { handleHTML } from "./src/remark/remark-embedder/handleHTML";
import { CodeSandboxTransformer } from "./src/remark/remark-embedder/transformer";
import { remarkLinkCard } from "./src/remark/remark-link-card";

const cache = remarkEmbedderCache(".cache/remark-embedder.json");

export default defineConfig({
  site: "https://blog.sakupi01.com/",
  integrations: [mdx(), cacheSave(cache)],
  markdown: {
    shikiConfig: {
      themes: {
        light: "catppuccin-latte",
        dark: "material-theme-darker",
      },
    },
    remarkPlugins: [
      [
        // @ts-expect-error wip
        remarkEmbedder.default,
        {
          cache,
          transformers: [
            // @ts-expect-error wip
            oembedTransformer.default,
            CodeSandboxTransformer,
          ],
          handleHTML,
        },
      ],
      [
        remarkLinkCard,
        {
          cache: true,
          shortenUrl: true,
        },
      ],
      remarkGfm,
      remarkBreaks,
      remarkDirective,
      customClassName,
      [
        remarkToc,
        {
          heading: "Table of Contents",
          ordered: false,
          tight: true,
          maxDepth: 3,
        },
      ],
      [
        collapse,
        {
          test: "Table of Contents",
          summary: (/** @type {any} */ str) => str,
        },
      ],
    ],
    rehypePlugins: [
      rehypeRaw,
      rehypeSlug,
      [rehypeStringify, { allowDangerousHtml: true }],
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
    ],
  },
});
