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
  "storybook-static/vercel-ignore-build-step.sh",
);
fs.writeFileSync(vercelIgnorePath, vercelIgnoreScript, { mode: 0o755 });

console.log("Created vercel-ignore-build-step.sh in storybook-static dir");
