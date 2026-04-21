/**
 * CSS Token Parser
 *
 * Parses CSS custom properties from primitives.css and semantic.css
 * to generate token lists dynamically.
 */

import primitivesCss from "../css/tokens/primitives.css?raw";
import semanticCss from "../css/tokens/semantic.css?raw";

interface TokenItem {
  token: string;
  label: string;
}

interface ColorScale {
  name: string;
  range: number[];
}

/**
 * Extract all CSS custom properties from a CSS string
 */
function extractTokens(css: string, prefix: string): string[] {
  const regex = new RegExp(`(${prefix}[a-z0-9-]+)\\s*:`, "gi");
  const matches = css.matchAll(regex);
  const tokens = new Set<string>();

  for (const match of matches) {
    if (match[1]) tokens.add(match[1]);
  }

  return Array.from(tokens).sort();
}

/**
 * Extract color scales from primitive tokens
 */
function extractColorScales(tokens: string[]): ColorScale[] {
  const colorPattern = /^--p-color-([a-z]+)-(\d+)$/;
  const scaleMap = new Map<string, Set<number>>();

  for (const token of tokens) {
    const match = token.match(colorPattern);
    if (match) {
      const [, colorName, step] = match;
      if (!colorName || !step) continue;
      if (!scaleMap.has(colorName)) {
        scaleMap.set(colorName, new Set());
      }
      scaleMap.get(colorName)!.add(Number(step));
    }
  }

  return Array.from(scaleMap.entries())
    .map(([name, steps]) => ({
      name,
      range: Array.from(steps).sort((a, b) => a - b),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Filter tokens by pattern and convert to TokenItem array
 */
function filterTokens(
  tokens: string[],
  pattern: RegExp,
  labelExtractor?: (token: string) => string
): TokenItem[] {
  return tokens
    .filter((token) => pattern.test(token))
    .map((token) => ({
      token,
      label: labelExtractor ? labelExtractor(token) : token,
    }));
}

/**
 * Create label from token name
 */
function createLabel(token: string, removePrefix: string): string {
  return token
    .replace(removePrefix, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

// Parse primitive tokens
const primitiveTokenList = extractTokens(primitivesCss, "--p-");

export const primitiveTokens = {
  // Color scales (red-0, red-1, ..., neutral-0, neutral-1, ...)
  colorScales: extractColorScales(primitiveTokenList),

  // Typography
  fonts: filterTokens(
    primitiveTokenList,
    /^--p-font-(sans|serif|mono)$/,
    (token) => createLabel(token, "--p-font-")
  ),
  typeScale: filterTokens(primitiveTokenList, /^--p-step--?\d+$/, (token) => {
    const step = token.replace("--p-step-", "");
    return `Step ${step}`;
  }).sort((a, b) => {
    const aStep = Number(a.token.replace("--p-step-", ""));
    const bStep = Number(b.token.replace("--p-step-", ""));
    return aStep - bStep;
  }),
  lineHeights: filterTokens(primitiveTokenList, /^--p-leading-/, (token) =>
    createLabel(token, "--p-leading-")
  ),
  weights: filterTokens(primitiveTokenList, /^--p-weight-/, (token) =>
    createLabel(token, "--p-weight-")
  ),

  // Spacing
  fixedSpaces: filterTokens(
    primitiveTokenList,
    /^--p-space-[23]?x[sl]$/,
    (token) => token.replace("--p-space-", "").toUpperCase()
  ).sort((a, b) => {
    const order = ["3xs", "2xs", "xs", "s", "m", "l", "xl", "2xl", "3xl"];
    const aIndex = order.indexOf(a.token.replace("--p-space-", ""));
    const bIndex = order.indexOf(b.token.replace("--p-space-", ""));
    return aIndex - bIndex;
  }),
  fluidSpaces: filterTokens(
    primitiveTokenList,
    /^--p-space-[23]?x[sl]-[23]?x[sl]$/,
    (token) => token.replace("--p-space-", "").toUpperCase()
  ),
  lineHeightSpaces: filterTokens(
    primitiveTokenList,
    /^--p-space-lh-/,
    (token) => token.replace("--p-space-lh-", "LH ").toUpperCase()
  ),

  // Sizing
  borders: filterTokens(primitiveTokenList, /^--p-border-\d+$/, (token) =>
    token.replace("--p-border-", "")
  ).sort((a, b) => Number(a.label) - Number(b.label)),
  radii: filterTokens(primitiveTokenList, /^--p-radius-/, (token) =>
    createLabel(token, "--p-radius-")
  ),
  icons: filterTokens(primitiveTokenList, /^--p-icon-/, (token) =>
    createLabel(token, "--p-icon-")
  ),

  // Animation
  durations: filterTokens(primitiveTokenList, /^--p-duration-/, (token) =>
    createLabel(token, "--p-duration-")
  ),
  easings: filterTokens(primitiveTokenList, /^--p-ease-/, (token) =>
    createLabel(token, "--p-ease-")
  ),

  // Effects
  shadows: filterTokens(primitiveTokenList, /^--p-shadow-/, (token) =>
    createLabel(token, "--p-shadow-")
  ),

  // Layout
  zIndex: filterTokens(primitiveTokenList, /^--p-z-/, (token) =>
    createLabel(token, "--p-z-")
  ),
};

// Parse semantic tokens
const semanticTokenList = extractTokens(semanticCss, "--s-");

export const semanticTokens = {
  // Colors
  surfaces: filterTokens(semanticTokenList, /^--s-color-surface-/, (token) =>
    createLabel(token, "--s-color-surface-")
  ),
  textColors: filterTokens(semanticTokenList, /^--s-color-text-/, (token) =>
    createLabel(token, "--s-color-text-")
  ),
  interactive: filterTokens(
    semanticTokenList,
    /^--s-color-(primary|link|focus)/,
    (token) => createLabel(token, "--s-color-")
  ),
  feedback: filterTokens(
    semanticTokenList,
    /^--s-color-(success|warning|error|info)/,
    (token) => createLabel(token, "--s-color-")
  ),
  borders: filterTokens(semanticTokenList, /^--s-color-border-/, (token) =>
    createLabel(token, "--s-color-border-")
  ),

  // Typography
  fontFamilies: filterTokens(semanticTokenList, /^--s-font-family-/, (token) =>
    createLabel(token, "--s-font-family-")
  ),
  fontSizes: filterTokens(
    semanticTokenList,
    /^--s-font-size-(xs|sm|base|lg|xl|\dxl)$/,
    (token) => createLabel(token, "--s-font-size-")
  ),
  headingSizes: filterTokens(
    semanticTokenList,
    /^--s-font-size-h\d$/,
    (token) => token.replace("--s-font-size-h", "H").toUpperCase()
  ),
  lineHeights: filterTokens(
    semanticTokenList,
    /^--s-line-height-(tight|base|relaxed)$/,
    (token) => createLabel(token, "--s-line-height-")
  ),
  headingLineHeights: filterTokens(
    semanticTokenList,
    /^--s-line-height-h\d$/,
    (token) => token.replace("--s-line-height-h", "H").toUpperCase()
  ),
  fontWeights: filterTokens(semanticTokenList, /^--s-font-weight-/, (token) =>
    createLabel(token, "--s-font-weight-")
  ),

  // Spacing
  gaps: filterTokens(
    semanticTokenList,
    /^--s-space-gap-(xs|sm|md|lg|xl|\dxl)$/,
    (token) => createLabel(token, "--s-space-gap-")
  ),
  fluidGaps: filterTokens(semanticTokenList, /^--s-space-gap-fluid-/, (token) =>
    createLabel(token, "--s-space-gap-fluid-")
  ),
  gutters: filterTokens(semanticTokenList, /^--s-space-gutter-/, (token) =>
    createLabel(token, "--s-space-gutter-")
  ),

  // Sizing
  borderWidths: filterTokens(semanticTokenList, /^--s-border-width-/, (token) =>
    createLabel(token, "--s-border-width-")
  ),
  borderRadii: filterTokens(semanticTokenList, /^--s-border-radius-/, (token) =>
    createLabel(token, "--s-border-radius-")
  ),
  iconSizes: filterTokens(semanticTokenList, /^--s-icon-size-/, (token) =>
    createLabel(token, "--s-icon-size-")
  ),

  // Animation
  durations: filterTokens(semanticTokenList, /^--s-duration-/, (token) =>
    createLabel(token, "--s-duration-")
  ),
  easings: filterTokens(semanticTokenList, /^--s-ease-/, (token) =>
    createLabel(token, "--s-ease-")
  ),
  transitions: filterTokens(semanticTokenList, /^--s-transition-/, (token) =>
    createLabel(token, "--s-transition-")
  ),

  // Effects
  shadows: filterTokens(semanticTokenList, /^--s-shadow-/, (token) =>
    createLabel(token, "--s-shadow-")
  ),
  focus: filterTokens(semanticTokenList, /^--s-focus-/, (token) =>
    createLabel(token, "--s-focus-")
  ),
  interactiveStates: filterTokens(
    semanticTokenList,
    /^--s-(hover|active)-/,
    (token) => createLabel(token, "--s-")
  ),

  // Layout
  zIndex: filterTokens(semanticTokenList, /^--s-z-index-/, (token) =>
    createLabel(token, "--s-z-index-")
  ),
  containers: filterTokens(semanticTokenList, /^--s-container-/, (token) =>
    createLabel(token, "--s-container-")
  ),
};
