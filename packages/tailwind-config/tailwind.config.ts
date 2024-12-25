import type { Config } from "tailwindcss";

// We want each package to be responsible for its own content.
const config: Omit<Config, "content"> = {
  theme: {
    container: {
      screens: {
        "2xl": "1400px",
        md: "600px",
      },
    },
    extend: {
      colors: {
        basic: {
          DEFAULT: "#2D2613",
          cool: "#0F172A",
        },
        subtle: "#AFAFAF",
        blossom: "#BAA0B5",
        tag: "#88744c",
        backquote: "#E3E3E3",
        break: "#EDE8DF",
        link: "#6b9aff",
        highlight: "#fdeedec4",
        primary: {
          DEFAULT: "#FAEDD2",
          subtle: "#FAF4ED",
        },
        button: {
          primary: {
            DEFAULT: "#F0F0F0",
            hover: "#2D2613",
          },
          secondary: {
            DEFAULT: "white",
            hover: "#2D2613",
          },
          subtle: {
            DEFAULT: "#FAF7F0",
            hover: "#FAEDD2",
          },
          ghost: {
            DEFAULT: "transparent",
            hover: "#FAF7F0",
          },
        },
      },
      borderRadius: {
        DEFAULT: "6px",
        lg: "10px",
        md: "6px",
        sm: "2px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "flip-diagonal-2-fwd": {
          "0%": {
            transform: "translateZ(0) rotate3d(-1, 1, 0, 0deg)",
          },
          to: {
            transform: "translateZ(160px) rotate3d(-1, 1, 0, 180deg)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "flip-diagonal-2-fwd":
          "flip-diagonal-2-fwd 0.4s cubic-bezier(0.455, 0.030, 0.515, 0.955)   both",
        none: "none",
        spin: "spin 1s linear infinite",
        ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        bounce: "bounce 1s infinite",
      },
      backgroundImage: {
        none: "none",
        "gradient-to-t": "linear-gradient(to top, var(--tw-gradient-stops))",
        "gradient-to-tr":
          "linear-gradient(to top right, var(--tw-gradient-stops))",
        "gradient-to-r": "linear-gradient(to right, var(--tw-gradient-stops))",
        "gradient-to-br":
          "linear-gradient(to bottom right, var(--tw-gradient-stops))",
        "gradient-to-b": "linear-gradient(to bottom, var(--tw-gradient-stops))",
        "gradient-to-bl":
          "linear-gradient(to bottom left, var(--tw-gradient-stops))",
        "gradient-to-l": "linear-gradient(to left, var(--tw-gradient-stops))",
        "gradient-to-tl":
          "linear-gradient(to top left, var(--tw-gradient-stops))",
      },
      aria: {
        busy: 'busy="true"',
        checked: 'checked="true"',
        disabled: 'disabled="true"',
        expanded: 'expanded="true"',
        hidden: 'hidden="true"',
        pressed: 'pressed="true"',
        readonly: 'readonly="true"',
        required: 'required="true"',
        selected: 'selected="true"',
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT:
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
        inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
        none: "none",
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.35rem" }],
        base: ["0.95rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
    },
  },
  plugins: [],
};
export default config;
