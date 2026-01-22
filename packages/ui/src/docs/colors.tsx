import { ColorItem, ColorPalette } from "@storybook/blocks";
import tokens from "../css/tokens/tokens.json";

type ColorList = Record<
  string, // color scheme name (e.g. gray)
  Record<string, string> // <level, color> （e.g. "0", "oklch(from var(--base-color, 0) calc(l - .20) c h)"）
>;

type HueList = Record<
  string, // color scheme name (e.g. red)
  string // hue value (e.g. "25")
>;

const hueList: HueList = tokens.tokens.hue;
const colorList: ColorList = tokens.tokens.color;
const baseColors = Object.keys(hueList).reduce(
  (prev: Record<string, string>, hueName) => {
    if (hueName === "selected" || hueName === "gray") {
      return prev;
    }
    prev[hueName] =
      `oklch(var(--lightness) var(--chroma-2) var(--hue-${hueName}))`;
    return prev;
  },
  {}
);

const ColorPaletteComponent = () => {
  return (
    <ColorPalette>
      <ColorItem
        key="hue"
        title="Hues"
        subtitle="Signature Color for each hue"
        colors={baseColors}
      />
      {Object.keys(colorList).map((colorName) => {
        const color = colorList[colorName];
        if (!color || colorName === "base") return null;

        const colors = Object.keys(color).reduce(
          (prev: Record<string, string>, level) => {
            prev[level] = color[level] ?? "";
            return prev;
          },
          {}
        );

        return (
          <ColorItem
            key={colorName}
            title={colorName}
            subtitle={`color.${colorName}`}
            colors={colors}
          />
        );
      })}
    </ColorPalette>
  );
};

export const Colors = ColorPaletteComponent;
