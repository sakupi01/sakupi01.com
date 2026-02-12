import fs from "node:fs";
import path from "node:path";
import type { RemarkEmbedderOptions } from "@remark-embedder/core";
import type { AstroIntegration } from "astro";

type Cache = RemarkEmbedderOptions["cache"] & {
  save(): Promise<void>;
};

export const cache = (cachePath: string): Cache => {
  const cache: Record<string, string> = (() => {
    try {
      return JSON.parse(fs.readFileSync(cachePath, "utf-8"));
    } catch {
      // If the file doesn't exist or has invalid JSON, return empty object
      return {};
    }
  })();

  return {
    async get(key: string) {
      return cache[key];
    },
    async set(key: string, value: string) {
      cache[key] = value;
    },
    async save() {
      // Ensure the directory exists before writing
      const directory = path.dirname(cachePath);
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }

      const sorted: Record<string, string> = {};
      for (const key of Object.keys(cache).sort()) {
        sorted[key] = cache[key];
      }

      await fs.promises.writeFile(cachePath, JSON.stringify(sorted, null, 2));
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
