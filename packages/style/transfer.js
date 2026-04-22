// transfer src/css and src/sakupi01.com dirs to storybook-static dir
import fs from "node:fs";
import path from "node:path";

const transfers = [
  { src: "src/css", dest: "storybook-static/css" },
  { src: "src/sakupi01.com", dest: "storybook-static/sakupi01.com" },
];

for (const { src, dest } of transfers) {
  const srcDir = path.join(import.meta.dirname, src);
  const destDir = path.join(import.meta.dirname, dest);

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  fs.cpSync(srcDir, destDir, { recursive: true });

  console.log(`Transferred ${src} dir to ${dest}`);
}

// Create vercel-ignore-build-step.sh in storybook-static
const vercelIgnoreScript = `#!/bin/bash
echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [[ "$VERCEL_GIT_COMMIT_REF" == "gh-pages" ]] ; then
  echo "🛑 - Build cancelled"
  exit 0;
else
  echo "✅ - Build can proceed"
  exit 1;
fi
`;

const vercelIgnorePath = path.join(
  import.meta.dirname,
  "storybook-static/vercel-ignore-build-step.sh"
);
fs.writeFileSync(vercelIgnorePath, vercelIgnoreScript, { mode: 0o755 });

console.log("Created vercel-ignore-build-step.sh in storybook-static dir");
