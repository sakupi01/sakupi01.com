const u=`/*
----------------------------------------------------------------------------
Primitive design tokens (--p- prefix).

Primitives are raw values with no semantic meaning. They should be referenced
by semantic tokens, not used directly in components.

- OKLCH color space: https://oklch.com/
- Utopia fluid type: https://utopia.fyi/type/calculator
- Utopia fluid space: https://utopia.fyi/space/calculator
- Naming Tokens: https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676
----------------------------------------------------------------------------
*/

/* -------------------------------------------------------------------------
   Register to @property
   <number> to enable calc() / animation
   ------------------------------------------------------------------------- */

/* Lightness scale */

@property --l-100 {
  inherits: true;
  initial-value: 0.99;
  syntax: "<number>";
}

@property --l-200 {
  inherits: true;
  initial-value: 0.92;
  syntax: "<number>";
}

@property --l-300 {
  inherits: true;
  initial-value: 0.85;
  syntax: "<number>";
}

@property --l-400 {
  inherits: true;
  initial-value: 0.79;
  syntax: "<number>";
}

@property --l-500 {
  inherits: true;
  initial-value: 0.71;
  syntax: "<number>";
}

@property --l-600 {
  inherits: true;
  initial-value: 0.61;
  syntax: "<number>";
}

@property --l-700 {
  inherits: true;
  initial-value: 0.52;
  syntax: "<number>";
}

@property --l-800 {
  inherits: true;
  initial-value: 0.4;
  syntax: "<number>";
}

@property --l-900 {
  inherits: true;
  initial-value: 0.3;
  syntax: "<number>";
}

/* Hue */

@property --p-color-red-hue {
  inherits: true;
  initial-value: 20;
  syntax: "<number>";
}

@property --p-color-orange-hue {
  inherits: true;
  initial-value: 50;
  syntax: "<number>";
}

@property --p-color-mustard-hue {
  inherits: true;
  initial-value: 90;
  syntax: "<number>";
}

@property --p-color-green-hue {
  inherits: true;
  initial-value: 130;
  syntax: "<number>";
}

@property --p-color-turquoise-hue {
  inherits: true;
  initial-value: 180;
  syntax: "<number>";
}

@property --p-color-pelorus-hue {
  inherits: true;
  initial-value: 210;
  syntax: "<number>";
}

@property --p-color-azure-hue {
  inherits: true;
  initial-value: 250;
  syntax: "<number>";
}

@property --p-color-lavender-hue {
  inherits: true;
  initial-value: 290;
  syntax: "<number>";
}

@property --p-color-fuchsia-hue {
  inherits: true;
  initial-value: 320;
  syntax: "<number>";
}

@property --p-color-flamingo-hue {
  inherits: true;
  initial-value: 360;
  syntax: "<number>";
}

@property --p-color-neutral-hue {
  inherits: true;
  initial-value: 50;
  syntax: "<number>";
}

@property --p-color-neutral-chroma {
  inherits: true;
  initial-value: 0.01;
  syntax: "<number>";
}

:where(html) {
  /* -------------------------------------------------------------------------
  Color Primitives
  See: https://harmonizer.evilmartians.com/
  Core Logic: Color scales using OKLCH with relative color syntax
  - @property to register hue・lightness as <number> (enable calc() / animation)
  - --l-N to manage lightness scale with shared tokens
  - For each family, use -500 as seed, others are derived using relative color syntax
    → \`h\` is not needed, \`l\` is shared scale without seed, \`c\` is specific to each step (different curves for each family)
     ------------------------------------------------------------------------- */

  /* --- Red Scale --- */
  --p-color-red-200: oklch(from var(--p-color-red-500) var(--l-200) 0.05 h);
  --p-color-red-300: oklch(from var(--p-color-red-500) var(--l-300) 0.09 h);
  --p-color-red-400: oklch(from var(--p-color-red-500) var(--l-400) 0.14 h);
  --p-color-red-500: oklch(var(--l-500) 0.21 var(--p-color-red-hue));
  --p-color-red-600: oklch(from var(--p-color-red-500) var(--l-600) 0.28 h);
  --p-color-red-700: oklch(from var(--p-color-red-500) var(--l-700) 0.24 h);
  --p-color-red-800: oklch(from var(--p-color-red-500) var(--l-800) 0.18 h);

  /* --- Orange Scale --- */
  --p-color-orange-200: oklch(
    from var(--p-color-orange-500) var(--l-200) 0.05 h
  );
  --p-color-orange-300: oklch(
    from var(--p-color-orange-500) var(--l-300) 0.1 h
  );
  --p-color-orange-400: oklch(
    from var(--p-color-orange-500) var(--l-400) 0.16 h
  );
  --p-color-orange-500: oklch(var(--l-500) 0.22 var(--p-color-orange-hue));
  --p-color-orange-600: oklch(
    from var(--p-color-orange-500) var(--l-600) 0.18 h
  );
  --p-color-orange-700: oklch(
    from var(--p-color-orange-500) var(--l-700) 0.16 h
  );
  --p-color-orange-800: oklch(
    from var(--p-color-orange-500) var(--l-800) 0.12 h
  );

  /* --- Mustard Scale --- */
  --p-color-mustard-200: oklch(
    from var(--p-color-mustard-500) var(--l-200) 0.13 h
  );
  --p-color-mustard-300: oklch(
    from var(--p-color-mustard-500) var(--l-300) 0.2 h
  );
  --p-color-mustard-400: oklch(
    from var(--p-color-mustard-500) var(--l-400) 0.19 h
  );
  --p-color-mustard-500: oklch(var(--l-500) 0.17 var(--p-color-mustard-hue));
  --p-color-mustard-600: oklch(
    from var(--p-color-mustard-500) var(--l-600) 0.14 h
  );
  --p-color-mustard-700: oklch(
    from var(--p-color-mustard-500) var(--l-700) 0.12 h
  );
  --p-color-mustard-800: oklch(
    from var(--p-color-mustard-500) var(--l-800) 0.09 h
  );

  /* --- Green Scale --- */
  --p-color-green-200: oklch(from var(--p-color-green-500) var(--l-200) 0.28 h);
  --p-color-green-300: oklch(from var(--p-color-green-500) var(--l-300) 0.26 h);
  --p-color-green-400: oklch(from var(--p-color-green-500) var(--l-400) 0.24 h);
  --p-color-green-500: oklch(var(--l-500) 0.22 var(--p-color-green-hue));
  --p-color-green-600: oklch(from var(--p-color-green-500) var(--l-600) 0.18 h);
  --p-color-green-700: oklch(from var(--p-color-green-500) var(--l-700) 0.16 h);
  --p-color-green-800: oklch(from var(--p-color-green-500) var(--l-800) 0.12 h);

  /* --- Turquoise Scale --- */
  --p-color-turquoise-200: oklch(
    from var(--p-color-turquoise-500) var(--l-200) 0.19 h
  );
  --p-color-turquoise-300: oklch(
    from var(--p-color-turquoise-500) var(--l-300) 0.2 h
  );
  --p-color-turquoise-400: oklch(
    from var(--p-color-turquoise-500) var(--l-400) 0.19 h
  );
  --p-color-turquoise-500: oklch(
    var(--l-500) 0.17 var(--p-color-turquoise-hue)
  );
  --p-color-turquoise-600: oklch(
    from var(--p-color-turquoise-500) var(--l-600) 0.14 h
  );
  --p-color-turquoise-700: oklch(
    from var(--p-color-turquoise-500) var(--l-700) 0.12 h
  );
  --p-color-turquoise-800: oklch(
    from var(--p-color-turquoise-500) var(--l-800) 0.09 h
  );

  /* --- Pelorus Scale --- */
  --p-color-pelorus-200: oklch(
    from var(--p-color-pelorus-500) var(--l-200) 0.09 h
  );
  --p-color-pelorus-300: oklch(
    from var(--p-color-pelorus-500) var(--l-300) 0.16 h
  );
  --p-color-pelorus-400: oklch(
    from var(--p-color-pelorus-500) var(--l-400) 0.18 h
  );
  --p-color-pelorus-500: oklch(var(--l-500) 0.16 var(--p-color-pelorus-hue));
  --p-color-pelorus-600: oklch(
    from var(--p-color-pelorus-500) var(--l-600) 0.13 h
  );
  --p-color-pelorus-700: oklch(
    from var(--p-color-pelorus-500) var(--l-700) 0.11 h
  );
  --p-color-pelorus-800: oklch(
    from var(--p-color-pelorus-500) var(--l-800) 0.09 h
  );

  /* --- Azure Scale --- */
  --p-color-azure-200: oklch(from var(--p-color-azure-500) var(--l-200) 0.04 h);
  --p-color-azure-300: oklch(from var(--p-color-azure-500) var(--l-300) 0.08 h);
  --p-color-azure-400: oklch(from var(--p-color-azure-500) var(--l-400) 0.12 h);
  --p-color-azure-500: oklch(var(--l-500) 0.17 var(--p-color-azure-hue));
  --p-color-azure-600: oklch(from var(--p-color-azure-500) var(--l-600) 0.22 h);
  --p-color-azure-700: oklch(from var(--p-color-azure-500) var(--l-700) 0.19 h);
  --p-color-azure-800: oklch(from var(--p-color-azure-500) var(--l-800) 0.14 h);

  /* --- Lavender Scale --- */
  --p-color-lavender-200: oklch(
    from var(--p-color-lavender-500) var(--l-200) 0.04 h
  );
  --p-color-lavender-300: oklch(
    from var(--p-color-lavender-500) var(--l-300) 0.08 h
  );
  --p-color-lavender-400: oklch(
    from var(--p-color-lavender-500) var(--l-400) 0.12 h
  );
  --p-color-lavender-500: oklch(var(--l-500) 0.17 var(--p-color-lavender-hue));
  --p-color-lavender-600: oklch(
    from var(--p-color-lavender-500) var(--l-600) 0.23 h
  );
  --p-color-lavender-700: oklch(
    from var(--p-color-lavender-500) var(--l-700) 0.3 h
  );
  --p-color-lavender-800: oklch(
    from var(--p-color-lavender-500) var(--l-800) 0.24 h
  );

  /* --- Fuchsia Scale --- */
  --p-color-fuchsia-200: oklch(
    from var(--p-color-fuchsia-500) var(--l-200) 0.06 h
  );
  --p-color-fuchsia-300: oklch(
    from var(--p-color-fuchsia-500) var(--l-300) 0.12 h
  );
  --p-color-fuchsia-400: oklch(
    from var(--p-color-fuchsia-500) var(--l-400) 0.17 h
  );
  --p-color-fuchsia-500: oklch(var(--l-500) 0.24 var(--p-color-fuchsia-hue));
  --p-color-fuchsia-600: oklch(
    from var(--p-color-fuchsia-500) var(--l-600) 0.33 h
  );
  --p-color-fuchsia-700: oklch(
    from var(--p-color-fuchsia-500) var(--l-700) 0.28 h
  );
  --p-color-fuchsia-800: oklch(
    from var(--p-color-fuchsia-500) var(--l-800) 0.21 h
  );

  /* --- Flamingo Scale --- */
  --p-color-flamingo-200: oklch(
    from var(--p-color-flamingo-500) var(--l-200) 0.05 h
  );
  --p-color-flamingo-300: oklch(
    from var(--p-color-flamingo-500) var(--l-300) 0.1 h
  );
  --p-color-flamingo-400: oklch(
    from var(--p-color-flamingo-500) var(--l-400) 0.15 h
  );
  --p-color-flamingo-500: oklch(var(--l-500) 0.23 var(--p-color-flamingo-hue));
  --p-color-flamingo-600: oklch(
    from var(--p-color-flamingo-500) var(--l-600) 0.28 h
  );
  --p-color-flamingo-700: oklch(
    from var(--p-color-flamingo-500) var(--l-700) 0.24 h
  );
  --p-color-flamingo-800: oklch(
    from var(--p-color-flamingo-500) var(--l-800) 0.18 h
  );

  /* Neutral Scale */
  --p-color-neutral-100: oklch(
    var(--l-100) var(--p-color-neutral-chroma) var(--p-color-neutral-hue)
  );
  --p-color-neutral-200: oklch(
    var(--l-200) var(--p-color-neutral-chroma) var(--p-color-neutral-hue)
  );
  --p-color-neutral-300: oklch(
    var(--l-300) var(--p-color-neutral-chroma) var(--p-color-neutral-hue)
  );
  --p-color-neutral-400: oklch(
    var(--l-400) var(--p-color-neutral-chroma) var(--p-color-neutral-hue)
  );
  --p-color-neutral-500: oklch(
    var(--l-500) var(--p-color-neutral-chroma) var(--p-color-neutral-hue)
  );
  --p-color-neutral-600: oklch(
    var(--l-600) var(--p-color-neutral-chroma) var(--p-color-neutral-hue)
  );
  --p-color-neutral-700: oklch(
    var(--l-700) var(--p-color-neutral-chroma) var(--p-color-neutral-hue)
  );
  --p-color-neutral-800: oklch(
    var(--l-800) var(--p-color-neutral-chroma) var(--p-color-neutral-hue)
  );
  --p-color-neutral-900: oklch(
    var(--l-900) var(--p-color-neutral-chroma) var(--p-color-neutral-hue)
  );

  /*
  --------------------------------------------------------------------------
  Typography primitives
  
  Design strategy (Miriam Suzanne's 2025 fluid typography series):
  
  1. Negotiate the root font-size via clamp() between user preference (1em)
     and design intent — never do px↔em conversion math. Each unit means
     what it means: 1em = user preference, 16px = design px intent.
     https://www.oddbird.net/2025/07/22/size-preferences/
  
  2. Keep the clamp's max/min ratio ≤ 1.125 on root so users can always
     reach 200% zoom (WCAG 1.4.4 safe well under the 2.5× hard limit).
     https://www.smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type/
  
  3. Derive the entire type scale from the base via pow() — one ratio
     variable controls everything; no magic numbers to maintain.
     https://web.dev/articles/baseline-in-action-fluid-type
  
  4. Multiply by --p-text-scale so OS text-scale (from <meta name=text-scale>)
     flows through every step and rem-based token automatically.
  --------------------------------------------------------------------------
  */

  /* Font families */
  --p-font-sans:
    inter, system-ui, -apple-system, blinkmacsystemfont, "Segoe UI", roboto,
    oxygen, ubuntu, cantarell, "Helvetica Neue", arial, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  --p-font-serif:
    alegreya, "Fallback for Alegreya", georgia, cambria, "Times New Roman",
    times, serif;
  --p-font-mono:
    cartograph, "Fallback for Cascadia", ui-monospace, "Source Code Pro", menlo,
    consolas, "DejaVu Sans Mono", monospace;

  /* OS text-scale multiplier. Defaults to 1; overridden in text-scale.css
     on pages that opt in via <meta name="text-scale" content="scale">. */
  --p-text-scale: 1;

  /* Negotiated base font-size.
       min 1em      — honor user preference when it's larger than our default
       ideal        — 16px intent + tiny fluid (0.25svi ≈ 2.4px / 1000svi);
                      kept minimal so browser zoom stays effective
       max 1.125em  — cap at 112.5% of user preference
     max / min ratio = 1.125, far under the 2.5× WCAG 1.4.4 hard ceiling. */
  --p-text-base: clamp(1em, 16px + 0.05svi, 1.125em);

  /* Typographic scale ratio. A media-query step rather than interpolation —
     per the web.dev guide, users rarely notice the jump during resize,
     and a constant ratio per breakpoint is simpler to reason about. */
  --p-text-ratio: 1.125; /* major second @ narrow */

  @media (width >= 60em) {
    --p-text-ratio: 1.175; /* minor third @ wide */
  }

  /* Fluid type scale derived via pow(). Step N = base × ratio^N.
     All steps inherit WCAG safety from --p-text-base (same min/max relation). */
  --p-step--1: calc(var(--p-text-base) * pow(var(--p-text-ratio), -1));
  --p-step-0: var(--p-text-base);
  --p-step-1: calc(var(--p-text-base) * pow(var(--p-text-ratio), 1));
  --p-step-2: calc(var(--p-text-base) * pow(var(--p-text-ratio), 2));
  --p-step-2-5: calc(var(--p-text-base) * pow(var(--p-text-ratio), 2.5));
  --p-step-3: calc(var(--p-text-base) * pow(var(--p-text-ratio), 3));
  --p-step-3-5: calc(var(--p-text-base) * pow(var(--p-text-ratio), 3.5));
  --p-step-4: calc(var(--p-text-base) * pow(var(--p-text-ratio), 4));
  --p-step-4-5: calc(var(--p-text-base) * pow(var(--p-text-ratio), 4.5));
  --p-step-5: calc(var(--p-text-base) * pow(var(--p-text-ratio), 5));
  --p-step-6: calc(var(--p-text-base) * pow(var(--p-text-ratio), 6));

  /* Line heights — unitless so they scale naturally with font-size */
  --p-text-leading-tight: 1.2;
  --p-text-leading-snug: 1.3;
  --p-text-leading-normal: 1.5;
  --p-text-leading-relaxed: 1.6;
  --p-text-leading-loose: 1.8;

  /* Font weights */
  --p-text-weight-light: 300;
  --p-text-weight-regular: 400;
  --p-text-weight-medium: 500;
  --p-text-weight-semibold: 600;
  --p-text-weight-bold: 700;

  /*
  --------------------------------------------------------------------------
  Rhythm primitives — vertical spacing INSIDE prose (lh-based)
  
  For \`margin-block\` between paragraphs, headings, lists within text flow.
  \`lh\` ties spacing to the CURRENT element's line-height, so a heading's
  own rhythm scales to its font-size — no per-level tuning needed.
  Scales with user text preferences automatically.
  https://www.oddbird.net/2025/09/23/type-units/
  --------------------------------------------------------------------------
  */
  --p-rhythm-3xs: 0.25lh;
  --p-rhythm-2xs: 0.5lh;
  --p-rhythm-xs: 0.75lh;
  --p-rhythm-s: 1lh;
  --p-rhythm-m: 1.5lh;
  --p-rhythm-l: 2lh;
  --p-rhythm-xl: 3lh;

  /*
  --------------------------------------------------------------------------
  Layout spacing primitives — structural gaps (px-clamp, NOT text-scaling)
  
  For padding, grid gaps, structural margin-inline. Uses px-based clamp so
  layout does NOT inflate when users scale text up. This is what lets users
  double their text size without being pushed off-screen horizontally
  (WCAG 1.4.10 Reflow).
  https://www.joshtumath.uk/posts/2026-01-27-try-text-scaling-support-in-chrome-canary/
  https://ashleemboyer.com/blog/why-you-should-use-px-units-for-margin-padding-and-other-spacing-techniques
  
  Fluid range: ~480px → ~1440px viewport. All ratios ≤ 1.5×.
  --------------------------------------------------------------------------
  */
  --p-space-3xs: clamp(4px, 4px + 0.21svi, 6px);
  --p-space-2xs: clamp(8px, 8px + 0.21svi, 10px);
  --p-space-xs: clamp(12px, 12px + 0.21svi, 14px);
  --p-space-s: clamp(16px, 16px + 0.21svi, 18px);
  --p-space-m: clamp(24px, 24px + 0.42svi, 28px);
  --p-space-l: clamp(32px, 32px + 0.63svi, 38px);
  --p-space-xl: clamp(48px, 48px + 0.83svi, 56px);
  --p-space-2xl: clamp(64px, 64px + 1.25svi, 76px);
  --p-space-3xl: clamp(96px, 96px + 1.87svi, 114px);

  /* One-up pairs for asymmetric / interpolating gaps */
  --p-space-3xs-2xs: clamp(4px, 4px + 0.42svi, 8px);
  --p-space-2xs-xs: clamp(8px, 8px + 0.42svi, 12px);
  --p-space-xs-s: clamp(12px, 12px + 0.42svi, 16px);
  --p-space-s-m: clamp(16px, 16px + 0.83svi, 24px);
  --p-space-m-l: clamp(24px, 24px + 0.83svi, 32px);
  --p-space-l-xl: clamp(32px, 32px + 1.67svi, 48px);
  --p-space-xl-2xl: clamp(48px, 48px + 1.67svi, 64px);
  --p-space-2xl-3xl: clamp(64px, 64px + 3.33svi, 96px);

  /*
  --------------------------------------------------------------------------
  Icons, borders, radii
  
  Content-scaling vs fixed distinction:
  - icon-inline (em): scales with surrounding text — for icons in prose
  - icon (rem):       scales with root text — standalone icons
  - border (rem):     content borders (button/input/card edges) scale with
                      text so they remain visible at larger sizes (a11y)
  - divider (px):     decorative separators stay hairline at any scale
  - radius (px):      corner shape stays visually consistent at any scale
                      (a 24px radius shouldn't become 36px on a larger button)
  --------------------------------------------------------------------------
  */
  /* For Inline */
  --p-icon-inline-xs: 1em;
  --p-icon-inline-s: 1.25em;
  --p-icon-inline-m: 1.5em;

  /* For Block */
  --p-icon-xs: 1rem;
  --p-icon-s: 1.25rem;
  --p-icon-m: 1.5rem;
  --p-icon-l: 2rem;
  --p-icon-xl: 3rem;

  /* For Block */
  --p-border-1: 0.0625rem;
  --p-border-2: 0.125rem;
  --p-border-4: 0.25rem;
  --p-border-8: 0.5rem;

  /* Non-scaling */
  --p-divider-1: 1px;
  --p-divider-2: 2px;
  --p-radius-xs: 2px;
  --p-radius-s: 4px;
  --p-radius-m: 8px;
  --p-radius-l: 16px;
  --p-radius-xl: 32px;
  --p-radius-full: 9999px;

  /*
  --------------------------------------------------------------------------
  Animation primitives
  --------------------------------------------------------------------------
  */

  /* Durations */
  --p-duration-instant: 50ms;
  --p-duration-fast: 150ms;
  --p-duration-moderate: 250ms;
  --p-duration-slow: 500ms;
  --p-duration-slower: 1000ms;

  /* Easing curves */
  --p-ease-linear: linear;
  --p-ease-in: cubic-bezier(0.4, 0, 1, 1);
  --p-ease-out: cubic-bezier(0, 0, 0.2, 1);
  --p-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --p-ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

  /*
  --------------------------------------------------------------------------
  Shadow primitives (box-shadow)
  --------------------------------------------------------------------------
  */

  --p-shadow-xs: 0 1px 2px 0 color-mix(in oklab, black 5%, transparent);
  --p-shadow-sm:
    0 1px 3px 0 color-mix(in oklab, black 10%, transparent),
    0 1px 2px -1px color-mix(in oklab, black 10%, transparent);
  --p-shadow-md:
    0 4px 6px -1px color-mix(in oklab, black 10%, transparent),
    0 2px 4px -2px color-mix(in oklab, black 10%, transparent);
  --p-shadow-lg:
    0 10px 15px -3px color-mix(in oklab, black 10%, transparent),
    0 4px 6px -4px color-mix(in oklab, black 10%, transparent);
  --p-shadow-xl:
    0 20px 25px -5px color-mix(in oklab, black 10%, transparent),
    0 8px 10px -6px color-mix(in oklab, black 10%, transparent);
  --p-shadow-2xl: 0 25px 50px -12px color-mix(in oklab, black 25%, transparent);

  /*
  --------------------------------------------------------------------------
  Z-index primitives
  --------------------------------------------------------------------------
  */

  --p-z-below: -1;
  --p-z-base: 0;
  --p-z-raised: 1;
  --p-z-dropdown: 10;
  --p-z-sticky: 100;
  --p-z-fixed: 200;
  --p-z-overlay: 300;
  --p-z-modal: 400;
  --p-z-popover: 500;
  --p-z-tooltip: 600;
}
`,v=`/*
----------------------------------------------------------------------------
Semantic tokens: --s- prefix

These tokens reference primitives (--p-) and provide meaningful,
context-aware names for common design patterns. Use semantic tokens
in components and layouts instead of primitives directly.

- Naming Tokens: https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676
----------------------------------------------------------------------------
*/

:where(html) {
  /* -------------------------------------------------------------------------
      Colors: Surfaces & Backgrounds
      ------------------------------------------------------------------------- */

  /* Base background of the page */
  --s-color-surface-base: light-dark(
    var(--p-color-neutral-100),
    var(--p-color-neutral-900)
  );

  /* Elevated surface for cards, panels, etc. */
  --s-color-surface-raised: light-dark(
    var(--p-color-neutral-200),
    var(--p-color-neutral-700)
  );

  /* Overlay surface for modals, drawers, etc. */
  --s-color-surface-overlay: light-dark(
    var(--p-color-neutral-200),
    var(--p-color-neutral-900)
  );

  /* Default surface for clickable elements */
  --s-color-surface-interactive: light-dark(
    var(--p-color-neutral-300),
    var(--p-color-neutral-700)
  );

  /* Hovered interactive surface */
  --s-color-surface-interactive-hover: light-dark(
    var(--p-color-neutral-400),
    var(--p-color-neutral-600)
  );

  /* -------------------------------------------------------------------------
      Colors: Text
      ------------------------------------------------------------------------- */

  /* Headings and body text */
  --s-color-text-primary: light-dark(
    var(--p-color-neutral-800),
    var(--p-color-neutral-100)
  );

  /* Supporting text and labels */
  --s-color-text-secondary: light-dark(
    var(--p-color-neutral-600),
    var(--p-color-neutral-300)
  );

  /* Placeholders, hints, and tertiary information */
  --s-color-text-tertiary: light-dark(
    var(--p-color-neutral-500),
    var(--p-color-neutral-400)
  );

  /* Disabled state */
  --s-color-text-disabled: light-dark(
    var(--p-color-neutral-400),
    var(--p-color-neutral-500)
  );

  /* Text on colored/dark backgrounds */
  --s-color-text-inverse: light-dark(
    var(--p-color-neutral-200),
    var(--p-color-neutral-800)
  );

  /* -------------------------------------------------------------------------
      Colors: Interactive Elements
      ------------------------------------------------------------------------- */

  /* CTAs and primary actions */
  --s-color-primary: var(--p-color-flamingo-500);
  --s-color-primary-hover: var(--p-color-flamingo-600);
  --s-color-primary-active: var(--p-color-flamingo-700);
  --s-color-primary-subtle: light-dark(
    var(--p-color-flamingo-200),
    var(--p-color-flamingo-800)
  );

  /* Links */
  --s-color-link: light-dark(
    var(--p-color-flamingo-600),
    var(--p-color-flamingo-300)
  );
  --s-color-link-hover: light-dark(
    var(--p-color-flamingo-700),
    var(--p-color-flamingo-200)
  );
  --s-color-link-visited: light-dark(
    var(--p-color-lavender-600),
    var(--p-color-lavender-300)
  );

  /* Focus ring — high contrast for accessibility */
  --s-color-focus: var(--p-color-flamingo-500);

  /* -------------------------------------------------------------------------
      Colors: Feedback & Status
      ------------------------------------------------------------------------- */

  /* Message (green) */
  --s-color-message: var(--p-color-green-500);
  --s-color-message-bg: light-dark(
    var(--p-color-green-200),
    var(--p-color-green-800)
  );
  --s-color-message-text: light-dark(
    var(--p-color-green-700),
    var(--p-color-green-200)
  );

  /* Warning (mustard) */
  --s-color-warning: var(--p-color-mustard-500);
  --s-color-warning-bg: light-dark(
    var(--p-color-mustard-200),
    var(--p-color-mustard-800)
  );
  --s-color-warning-text: light-dark(
    var(--p-color-mustard-700),
    var(--p-color-mustard-200)
  );

  /* Memo (fuchsia) */
  --s-color-memo: var(--p-color-fuchsia-500);
  --s-color-memo-bg: light-dark(
    var(--p-color-fuchsia-200),
    var(--p-color-fuchsia-800)
  );
  --s-color-memo-text: light-dark(
    var(--p-color-fuchsia-700),
    var(--p-color-fuchsia-200)
  );

  /* Info (turquoise) */
  --s-color-info: var(--p-color-azure-500);
  --s-color-info-bg: light-dark(
    var(--p-color-azure-200),
    var(--p-color-azure-800)
  );
  --s-color-info-text: light-dark(
    var(--p-color-azure-700),
    var(--p-color-azure-200)
  );

  /* -------------------------------------------------------------------------
      Colors: Borders
      ------------------------------------------------------------------------- */

  /* Dividers and low-emphasis borders */
  --s-color-border-subtle: light-dark(
    var(--p-color-neutral-300),
    var(--p-color-neutral-700)
  );

  /* Standard borders for inputs, cards, etc. */
  --s-color-border-default: light-dark(
    var(--p-color-neutral-400),
    var(--p-color-neutral-600)
  );

  /* Strong borders and separators */
  --s-color-border-strong: light-dark(
    var(--p-color-neutral-600),
    var(--p-color-neutral-500)
  );

  /* Focus outline */
  --s-color-border-focus: var(--s-color-focus);

  /* -------------------------------------------------------------------------
      Typography: Font Families
      ------------------------------------------------------------------------- */

  --s-font-family-base: var(--p-font-sans);
  --s-font-family-serif: var(--p-font-serif);
  --s-font-family-mono: var(--p-font-mono);

  /* -------------------------------------------------------------------------
     Typography: font sizes
     Use on \`font-size\`. Scales with user text preference and OS text-scale.
     ------------------------------------------------------------------------- */

  --s-font-size-xs: var(--p-step--1);
  --s-font-size-sm: var(--p-step-0);
  --s-font-size-base: var(--p-step-0);
  --s-font-size-lg: var(--p-step-1);
  --s-font-size-xl: var(--p-step-2);
  --s-font-size-2xl: var(--p-step-3);
  --s-font-size-3xl: var(--p-step-4);
  --s-font-size-4xl: var(--p-step-5);
  --s-font-size-5xl: var(--p-step-6);

  /* Heading-specific aliases */
  --s-font-size-h1: var(--p-step-5);
  --s-font-size-h2: var(--p-step-3);
  --s-font-size-h3: var(--p-step-2-5);
  --s-font-size-h4: var(--p-step-2);
  --s-font-size-h5: var(--p-step-1);
  --s-font-size-h6: var(--p-step-0);

  /* -------------------------------------------------------------------------
     Typography: weights — reference renamed primitives
     ------------------------------------------------------------------------- */

  --s-font-weight-normal: var(--p-text-weight-regular);
  --s-font-weight-medium: var(--p-text-weight-medium);
  --s-font-weight-semibold: var(--p-text-weight-semibold);
  --s-font-weight-bold: var(--p-text-weight-bold);

  /* -------------------------------------------------------------------------
     Typography: line heights — reference renamed primitives
     ------------------------------------------------------------------------- */

  --s-line-height-tight: var(--p-text-leading-tight);
  --s-line-height-base: var(--p-text-leading-normal);
  --s-line-height-relaxed: var(--p-text-leading-relaxed);
  --s-line-height-h6: var(--p-text-leading-normal);
  --s-line-height-h5: var(--p-text-leading-tight);
  --s-line-height-h4: var(--p-text-leading-tight);
  --s-line-height-h3: var(--p-text-leading-tight);
  --s-line-height-h2: var(--p-text-leading-tight);
  --s-line-height-h1: var(--p-text-leading-tight);

  /* -------------------------------------------------------------------------
     Spacing: Gutter (inside prose, lh-based)
     
     Use on \`margin-block\` in prose blocks (paragraphs, headings, lists).
     \`lh\` ties each element's gutter to its own line-height, so headings
     get proportionally larger gutters without manual tuning.
     https://webkit.org/blog/16831/line-height-units/
     ------------------------------------------------------------------------- */

  --s-space-gutter-3xs: var(--p-rhythm-3xs);
  --s-space-gutter-2xs: var(--p-rhythm-2xs);
  --s-space-gutter-xs: var(--p-rhythm-xs);
  --s-space-gutter-sm: var(--p-rhythm-s);
  --s-space-gutter-md: var(--p-rhythm-m);
  --s-space-gutter-lg: var(--p-rhythm-l);
  --s-space-gutter-xl: var(--p-rhythm-xl);

  /* -------------------------------------------------------------------------
     Spacing: Gap (between sections, rlh-based)
     
     Use on \`gap\` between text-oriented blocks (card list, article sections).
     \`rlh\` anchors to root line-height — consistent across type scales on
     the same page, and scales with user text preference via root font-size.
     ------------------------------------------------------------------------- */

  --s-space-gap-3xs: 0.25rlh;
  --s-space-gap-2xs: 0.5rlh;
  --s-space-gap-xs: 0.75rlh;
  --s-space-gap-sm: 1rlh;
  --s-space-gap-md: 1.5rlh;
  --s-space-gap-lg: 2rlh;
  --s-space-gap-xl: 3rlh;

  /* -------------------------------------------------------------------------
     Spacing: Layout (structural, px-based, does NOT scale with text)
     
     Use on \`padding\`, structural \`margin-inline\`, and grid/flex gaps in
     NON-text contexts (button internals, card padding, dashboard grids).
     px-clamp ensures layout doesn't inflate when users enlarge text —
     required for WCAG 1.4.10 Reflow at 200% text scale.
     https://www.joshtumath.uk/posts/2026-01-27-try-text-scaling-support-in-chrome-canary/
     ------------------------------------------------------------------------- */

  --s-space-layout-3xs: var(--p-space-3xs);
  --s-space-layout-2xs: var(--p-space-2xs);
  --s-space-layout-xs: var(--p-space-xs);
  --s-space-layout-sm: var(--p-space-s);
  --s-space-layout-md: var(--p-space-m);
  --s-space-layout-lg: var(--p-space-l);
  --s-space-layout-xl: var(--p-space-xl);
  --s-space-layout-2xl: var(--p-space-2xl);
  --s-space-layout-3xl: var(--p-space-3xl);

  /* Layout pairs — asymmetric / interpolating structural spacing */
  --s-space-layout-pair-xs: var(--p-space-3xs-2xs);
  --s-space-layout-pair-sm: var(--p-space-2xs-xs);
  --s-space-layout-pair-md: var(--p-space-xs-s);
  --s-space-layout-pair-lg: var(--p-space-s-m);
  --s-space-layout-pair-xl: var(--p-space-m-l);
  --s-space-layout-pair-2xl: var(--p-space-l-xl);
  --s-space-layout-pair-3xl: var(--p-space-xl-2xl);
  --s-space-layout-pair-4xl: var(--p-space-2xl-3xl);

  /* -------------------------------------------------------------------------
     Borders
     
     - border-width: rem-based — content borders (button/input/card edges)
       scale with text so they stay visible as users scale up (a11y).
     - divider-width: px-based — decorative separators stay hairline.
     ------------------------------------------------------------------------- */

  --s-border-width-thin: var(--p-border-1);
  --s-border-width-base: var(--p-border-2);
  --s-border-width-thick: var(--p-border-4);
  --s-divider-width-thin: var(--p-divider-1);
  --s-divider-width-base: var(--p-divider-2);

  /* Border radius — px-based so corner shapes stay visually consistent
     regardless of text scale (avoids "inflated button" feel on zoom). */
  --s-border-radius-sm: var(--p-radius-xs);
  --s-border-radius-md: var(--p-radius-s);
  --s-border-radius-lg: var(--p-radius-m);
  --s-border-radius-xl: var(--p-radius-l);
  --s-border-radius-full: var(--p-radius-full);

  /* -------------------------------------------------------------------------
     Icons
     - inline: em-based, for icons flowing with text (bullets in headings etc.)
     - size:   rem-based, for standalone icons (toolbar buttons, avatars)
     ------------------------------------------------------------------------- */

  --s-icon-size-inline-xs: var(--p-icon-inline-xs);
  --s-icon-size-inline-sm: var(--p-icon-inline-s);
  --s-icon-size-inline-md: var(--p-icon-inline-m);
  --s-icon-size-xs: var(--p-icon-xs);
  --s-icon-size-sm: var(--p-icon-s);
  --s-icon-size-md: var(--p-icon-m);
  --s-icon-size-lg: var(--p-icon-l);
  --s-icon-size-xl: var(--p-icon-xl);

  /* -------------------------------------------------------------------------
      Animations: Durations
      ------------------------------------------------------------------------- */

  --s-duration-instant: var(--p-duration-instant);
  --s-duration-fast: var(--p-duration-fast);
  --s-duration-base: var(--p-duration-moderate);
  --s-duration-slow: var(--p-duration-slow);

  /* -------------------------------------------------------------------------
      Animations: Easing Functions
      ------------------------------------------------------------------------- */

  --s-ease-linear: var(--p-ease-linear);
  --s-ease-in: var(--p-ease-in);
  --s-ease-out: var(--p-ease-out);
  --s-ease-in-out: var(--p-ease-in-out);

  /* Composite animation values for common use cases */
  --s-transition-fast: var(--p-duration-fast) var(--p-ease-out);
  --s-transition-base: var(--p-duration-moderate) var(--p-ease-in-out);
  --s-transition-slow: var(--p-duration-slow) var(--p-ease-in-out);

  /* -------------------------------------------------------------------------
      Effects: Shadows
      ------------------------------------------------------------------------- */

  --s-shadow-sm: var(--p-shadow-sm);
  --s-shadow-md: var(--p-shadow-sm);
  --s-shadow-lg: var(--p-shadow-md);
  --s-shadow-xl: var(--p-shadow-lg);
  --s-shadow-2xl: var(--p-shadow-xl);

  /* -------------------------------------------------------------------------
      Effects: Focus Styles
      Transparent outline ensures high contrast mode compatibility.
      Reference: https://css-tricks.com/the-focus-visible-trick/
      ------------------------------------------------------------------------- */

  --s-focus-ring-width: var(--p-border-4);
  --s-focus-ring-color: var(--s-color-focus);
  --s-focus-ring-offset: 2px;
  --s-focus-shadow: 0 0 0 var(--s-focus-ring-width) var(--s-focus-ring-color);
  --s-focus-outline: var(--s-focus-ring-width) solid transparent;

  /* -------------------------------------------------------------------------
      Effects: Interactive States
      ------------------------------------------------------------------------- */

  --s-hover-opacity: 0.8;
  --s-active-scale: 0.975;

  /* -------------------------------------------------------------------------
      Layout: Z-Index Scale
      ------------------------------------------------------------------------- */

  --s-z-index-below: var(--p-z-below);
  --s-z-index-base: var(--p-z-base);
  --s-z-index-dropdown: var(--p-z-dropdown);
  --s-z-index-sticky: var(--p-z-sticky);
  --s-z-index-overlay: var(--p-z-overlay);
  --s-z-index-modal: var(--p-z-modal);
  --s-z-index-popover: var(--p-z-popover);
  --s-z-index-tooltip: var(--p-z-tooltip);

  /* -------------------------------------------------------------------------
      Layout: Container Widths
      Max widths for content containers based on readability research.
      ------------------------------------------------------------------------- */

  --s-container-xs: 20rem; /*  ~320px */
  --s-container-sm: 24rem; /*  ~384px */
  --s-container-md: 28rem; /*  ~448px */
  --s-container-lg: 32rem; /*  ~512px */
  --s-container-xl: 36rem; /*  ~576px */
  --s-container-2xl: 42rem; /*  ~672px */
  --s-container-3xl: 48rem; /*  ~768px */
  --s-container-4xl: 56rem; /*  ~896px */
  --s-container-5xl: 64rem; /* ~1024px */
  --s-container-6xl: 72rem; /* ~1152px */
  --s-container-7xl: 80rem; /* ~1280px */
}
`;function h(n,l){const a=new RegExp(`(${l}[a-z0-9-]+)\\s*:`,"gi"),s=n.matchAll(a),i=new Set;for(const p of s)p[1]&&i.add(p[1]);return Array.from(i).sort()}function d(n){const l=/^--p-color-([a-z]+)-(\d+)$/,a=new Map;for(const s of n){const i=s.match(l);if(i){const[,p,c]=i;if(!p||!c)continue;a.has(p)||a.set(p,new Set),a.get(p).add(Number(c))}}return Array.from(a.entries()).map(([s,i])=>({name:s,range:Array.from(i).sort((p,c)=>p-c)})).sort((s,i)=>s.name.localeCompare(i.name))}function r(n,l,a){return n.filter(s=>l.test(s)).map(s=>({token:s,label:a?a(s):s}))}function e(n,l){return n.replace(l,"").split("-").map(a=>a.charAt(0).toUpperCase()+a.slice(1)).join(" ")}const t=h(u,"--p-"),m={colorScales:d(t),fonts:r(t,/^--p-font-(sans|serif|mono)$/,n=>e(n,"--p-font-")),typeScale:r(t,/^--p-step--?\d+$/,n=>`Step ${n.replace("--p-step-","")}`).sort((n,l)=>{const a=Number(n.token.replace("--p-step-","")),s=Number(l.token.replace("--p-step-",""));return a-s}),lineHeights:r(t,/^--p-leading-/,n=>e(n,"--p-leading-")),weights:r(t,/^--p-weight-/,n=>e(n,"--p-weight-")),fixedSpaces:r(t,/^--p-space-[23]?x[sl]$/,n=>n.replace("--p-space-","").toUpperCase()).sort((n,l)=>{const a=["3xs","2xs","xs","s","m","l","xl","2xl","3xl"],s=a.indexOf(n.token.replace("--p-space-","")),i=a.indexOf(l.token.replace("--p-space-",""));return s-i}),fluidSpaces:r(t,/^--p-space-[23]?x[sl]-[23]?x[sl]$/,n=>n.replace("--p-space-","").toUpperCase()),lineHeightSpaces:r(t,/^--p-space-lh-/,n=>n.replace("--p-space-lh-","LH ").toUpperCase()),borders:r(t,/^--p-border-\d+$/,n=>n.replace("--p-border-","")).sort((n,l)=>Number(n.label)-Number(l.label)),radii:r(t,/^--p-radius-/,n=>e(n,"--p-radius-")),icons:r(t,/^--p-icon-/,n=>e(n,"--p-icon-")),durations:r(t,/^--p-duration-/,n=>e(n,"--p-duration-")),easings:r(t,/^--p-ease-/,n=>e(n,"--p-ease-")),shadows:r(t,/^--p-shadow-/,n=>e(n,"--p-shadow-")),zIndex:r(t,/^--p-z-/,n=>e(n,"--p-z-"))},o=h(v,"--s-"),x={surfaces:r(o,/^--s-color-surface-/,n=>e(n,"--s-color-surface-")),textColors:r(o,/^--s-color-text-/,n=>e(n,"--s-color-text-")),interactive:r(o,/^--s-color-(primary|link|focus)/,n=>e(n,"--s-color-")),feedback:r(o,/^--s-color-(success|warning|error|info)/,n=>e(n,"--s-color-")),borders:r(o,/^--s-color-border-/,n=>e(n,"--s-color-border-")),fontFamilies:r(o,/^--s-font-family-/,n=>e(n,"--s-font-family-")),fontSizes:r(o,/^--s-font-size-(xs|sm|base|lg|xl|\dxl)$/,n=>e(n,"--s-font-size-")),headingSizes:r(o,/^--s-font-size-h\d$/,n=>n.replace("--s-font-size-h","H").toUpperCase()),lineHeights:r(o,/^--s-line-height-(tight|base|relaxed)$/,n=>e(n,"--s-line-height-")),headingLineHeights:r(o,/^--s-line-height-h\d$/,n=>n.replace("--s-line-height-h","H").toUpperCase()),fontWeights:r(o,/^--s-font-weight-/,n=>e(n,"--s-font-weight-")),gaps:r(o,/^--s-space-gap-(xs|sm|md|lg|xl|\dxl)$/,n=>e(n,"--s-space-gap-")),fluidGaps:r(o,/^--s-space-gap-fluid-/,n=>e(n,"--s-space-gap-fluid-")),gutters:r(o,/^--s-space-gutter-/,n=>e(n,"--s-space-gutter-")),borderWidths:r(o,/^--s-border-width-/,n=>e(n,"--s-border-width-")),borderRadii:r(o,/^--s-border-radius-/,n=>e(n,"--s-border-radius-")),iconSizes:r(o,/^--s-icon-size-/,n=>e(n,"--s-icon-size-")),durations:r(o,/^--s-duration-/,n=>e(n,"--s-duration-")),easings:r(o,/^--s-ease-/,n=>e(n,"--s-ease-")),transitions:r(o,/^--s-transition-/,n=>e(n,"--s-transition-")),shadows:r(o,/^--s-shadow-/,n=>e(n,"--s-shadow-")),focus:r(o,/^--s-focus-/,n=>e(n,"--s-focus-")),interactiveStates:r(o,/^--s-(hover|active)-/,n=>e(n,"--s-")),zIndex:r(o,/^--s-z-index-/,n=>e(n,"--s-z-index-")),containers:r(o,/^--s-container-/,n=>e(n,"--s-container-"))};export{m as p,x as s};
