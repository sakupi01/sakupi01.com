import type { Preview } from "@storybook/react";
import "../src/css/tokens/tokens.css";
import "../src/css/index.css";
import theme from "./sakupi01.com.theme";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      values: [
        { name: "light", value: "#F7F9F2" },
        { name: "dark", value: "#333" },
      ],
      default: "light",
    },
    docs: {
      theme: theme,
    },
  },
};

export default preview;
