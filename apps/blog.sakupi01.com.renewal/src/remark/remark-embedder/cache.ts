import fs from "node:fs";
import type { RemarkEmbedderOptions } from "@remark-embedder/core";
import type { AstroIntegration } from "astro";

type Cache = RemarkEmbedderOptions["cache"] & {
  save(): Promise<void>;
};

export const cache = (path: string): Cache => {
  const cache: Record<string, string> = (() => {
    try {
      return JSON.parse(fs.readFileSync(path, "utf-8"));
    } catch (e) {
      /* ignore */
    }
    return {};
  })();
  return {
    async get(key: string) {
      return cache[key];
    },

    async set(key: string, value: string) {
      cache[key] = value;
    },

    async save() {
      const sorted: Record<string, string> = {};
      for (const key of Object.keys(cache).sort()) {
        sorted[key] = cache[key];
      }
      await fs.promises.writeFile(path, JSON.stringify(sorted, null, 2));
    },
  };
};

export const cacheSave = (cache: Cache): AstroIntegration => {
  return {
    name: "cache-save",
    hooks: {
      "astro:build:generated": async () => {
        await cache.save();
      },
    },
  };
};
