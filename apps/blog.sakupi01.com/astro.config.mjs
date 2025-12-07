import mdx from "@astrojs/mdx";
import { defineConfig } from "astro/config";
import remarkToc from "remark-toc";
import remarkEmbedder from "@remark-embedder/core";
import {
  cache as remarkEmbedderCache,
  cacheSave,
} from "./src/remark/remark-embedder/cache";
import oembedTransformer from "@remark-embedder/transformer-oembed";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
// @ts-ignore
import collapse from "remark-collapse";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { remarkLinkCard } from "./src/remark/remark-link-card";
import { customClassName } from "./src/remark/customClassName";
import { handleHTML } from "./src/remark/remark-embedder/handleHTML";
import { CodeSandboxTransformer } from "./src/remark/remark-embedder/transformer";

import partytown from "@astrojs/partytown";

const cache = remarkEmbedderCache(".cache/remark-embedder.json");

export default defineConfig({
  site: "https://blog.sakupi01.com/",
  integrations: [
    mdx(),
    cacheSave(cache),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: "catppuccin-latte",
        dark: "material-theme-darker",
      },
    },
    remarkPlugins: [
      [
        // @ts-ignore
        remarkEmbedder.default,
        {
          cache,
          transformers: [
            // @ts-ignore
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
      rehypeSlug,
      [rehypeStringify, { allowDangerousHtml: true }],
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
    ],
  },
});
