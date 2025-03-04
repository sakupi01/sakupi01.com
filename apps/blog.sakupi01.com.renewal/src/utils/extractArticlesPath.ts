export function extractArticlesPath(inputPath: string): string | null {
  // Validate input
  if (!inputPath || typeof inputPath !== "string") {
    return null;
  }

  // Normalize the path to handle different separators and remove redundant elements
  const normalizedPath = inputPath.trim().replace(/\\/g, "/");

  // Use a regex to match paths that contain /articles/ followed by valid path characters
  const articlesPathRegex = /\/articles\/([a-zA-Z0-9_\-\.\/]+)/;
  const match = normalizedPath.match(articlesPathRegex);

  if (match?.[1]) {
    // Return the matched articles subpath
    return match[1];
  }

  return null;
}
