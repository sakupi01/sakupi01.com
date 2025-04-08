// transfer src/css dir to storybook-static dir
import fs from "node:fs";
import path from "node:path";

const srcDir = path.join(import.meta.dirname, "src/css");
const destDir = path.join(import.meta.dirname, "storybook-static/css");

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.cpSync(srcDir, destDir, { recursive: true });

console.log("Transferred src/css dir to storybook-static dir");
