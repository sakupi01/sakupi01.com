import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import css from "@eslint/css";

export default [
  // Ignore patterns
  {
    ignores: [
      "**/.astro/**",
      "**/dist/**",
      "**/node_modules/**",
      "**/.vscode/**",
      "**/.idea/**",
      "**/coverage/**",
      "**/generated/**",
      "**/remark-link-card/**",
      "**/storybook-static/**",
      "**/.cache/**",
    ],
  },

  // Base recommended configuration for all files
  eslint.configs.recommended,

  // TypeScript configuration
  ...tseslint.configs.recommended,

  // Astro configuration
  ...eslintPluginAstro.configs.recommended,

  // Global settings for all files
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        // Node.js globals
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
        console: "readonly",
        // Browser globals
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        HTMLElement: "readonly",
        Element: "readonly",
        Node: "readonly",
        customElements: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        Audio: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        Event: "readonly",
        CustomEvent: "readonly",
        MutationObserver: "readonly",
        IntersectionObserver: "readonly",
        ResizeObserver: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        // ES2022 globals are included by default with ecmaVersion: 'latest'
      },
    },
  },

  // TypeScript files configuration
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      // React hooks rules (for packages/ui)
      "@typescript-eslint/no-unused-vars": "error",
    },
  },

  // TypeScript definition files - allow triple-slash references
  {
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },

  // Astro files configuration
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: eslintPluginAstro.parser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".astro"],
      },
    },
  },
  {
    files: ["./**/*.css", "src/**/*.astro"],
    plugins: {
      css,
    },
    language: "css/css",
    rules: {
      "css/no-duplicate-imports": "error",
      // Lint CSS files to ensure they are using
      // only Baseline Widely available features:
      "css/require-baseline": [
        "warn",
        {
          available: "widely",
        },
      ],
    },
  },
  // Prettier configuration (must be last to override other configs)
  eslintPluginPrettier,

  // Disable prettier/prettier for .astro files (must be AFTER eslintPluginPrettier).
  // prettier-plugin-astro handles formatting via `prettier --write .` directly,
  // but eslint-plugin-prettier cannot parse .astro inline <script>/<style>.
  // Also target virtual files extracted by eslint-plugin-astro's processor.
  {
    files: ["**/*.astro", "**/*.astro/*.js", "**/*.astro/*.ts"],
    rules: {
      "prettier/prettier": "off",
    },
  },
];
