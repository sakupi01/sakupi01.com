// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  // Keep pre-v7 whitespace handling; the v7 default "jsx" drops whitespace around inline elements.
  compressHTML: true,
  integrations: [],
});
