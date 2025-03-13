import fs from "node:fs";
import { join } from "node:path";
/*
 * Check if tailwindcss is there checking if tailwind.config.ts|js exists
 */
export const checkTailwindCSS = async () => {
  const path2Config = join(process.cwd(), "tailwind.config");
  const existsTS = fs.existsSync(`${path2Config}.ts`);
  const existsJS = fs.existsSync(`${path2Config}.js`);
  return existsTS || existsJS;
};
