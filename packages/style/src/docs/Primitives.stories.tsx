import type { Meta, StoryObj } from "@storybook/react";
import "../css/tokens/primitives.css";
import { primitiveTokens } from "./parse-tokens";

const meta = {
  title: "Design Tokens/Primitives",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ColorSwatch = ({ token, label }: { token: string; label: string }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      marginBottom: "0.5rem",
    }}
  >
    <div
      style={{
        width: "4rem",
        height: "2.5rem",
        backgroundColor: `var(${token})`,
        border: "1px solid #ccc",
        borderRadius: "0.25rem",
      }}
    />
    <div>
      <div style={{ fontWeight: 500 }}>{label}</div>
      <code style={{ fontSize: "0.875rem", color: "#666" }}>{token}</code>
    </div>
  </div>
);

const ColorScale = ({
  colorName,
  range,
}: {
  colorName: string;
  range: number[];
}) => (
  <div style={{ marginBottom: "2rem" }}>
    <h3 style={{ marginBottom: "1rem", textTransform: "capitalize" }}>
      {colorName}
    </h3>
    {range.map((n) => (
      <ColorSwatch
        key={n}
        token={`--p-color-${colorName}-${n}`}
        label={`${colorName}-${n}`}
      />
    ))}
  </div>
);

const SpaceExample = ({ token, label }: { token: string; label: string }) => (
  <div style={{ marginBottom: "0.75rem" }}>
    <div style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>
      <strong>{label}</strong> <code style={{ color: "#666" }}>{token}</code>
    </div>
    <div
      style={{
        height: "1.5rem",
        backgroundColor: "#4f46e5",
        width: `var(${token})`,
        borderRadius: "0.25rem",
      }}
    />
  </div>
);

const TypeExample = ({ token, label }: { token: string; label: string }) => (
  <div style={{ marginBottom: "1rem" }}>
    <div style={{ fontSize: "var(--p-step-0)", marginBottom: "0.25rem" }}>
      <strong>{label}</strong> <code style={{ color: "#666" }}>{token}</code>
    </div>
    <div style={{ fontSize: `var(${token})` }}>
      The quick brown fox jumps over the lazy dog
    </div>
  </div>
);

export const Colors: Story = {
  render: () => (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem" }}>Color Primitives</h1>

      <h2 style={{ marginBottom: "1.5rem" }}>Color Scales</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        {primitiveTokens.colorScales.map((scale) => (
          <ColorScale
            key={scale.name}
            colorName={scale.name}
            range={scale.range}
          />
        ))}
      </div>
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem" }}>Typography Primitives</h1>

      <h2 style={{ marginBottom: "1rem" }}>Type Scale (Fluid)</h2>
      {primitiveTokens.typeScale.map(({ token, label }) => (
        <TypeExample key={token} token={token} label={label} />
      ))}

      <h2 style={{ marginTop: "3rem", marginBottom: "1rem" }}>Font Families</h2>
      {primitiveTokens.fonts.map(({ token, label }) => (
        <div key={token} style={{ marginBottom: "1rem" }}>
          <div>
            <strong>{label}</strong>{" "}
            <code style={{ color: "#666" }}>{token}</code>
          </div>
          <div style={{ fontFamily: `var(${token})` }}>
            The quick brown fox jumps over the lazy dog
          </div>
        </div>
      ))}

      <h2 style={{ marginTop: "3rem", marginBottom: "1rem" }}>Line Heights</h2>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        {primitiveTokens.lineHeights.map(({ token, label }) => (
          <div key={token}>
            <div style={{ marginBottom: "0.5rem" }}>
              <strong>{label}</strong>
              <br />
              <code style={{ fontSize: "0.875rem", color: "#666" }}>
                {token}
              </code>
            </div>
            <div
              style={{
                maxWidth: "200px",
                lineHeight: `var(${token})`,
                border: "1px solid #ccc",
                padding: "0.5rem",
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem" }}>Spacing Primitives</h1>

      <h2 style={{ marginBottom: "1rem" }}>Fixed Steps (Fluid)</h2>
      {primitiveTokens.fixedSpaces.map(({ token, label }) => (
        <SpaceExample key={token} token={token} label={label} />
      ))}

      <h2 style={{ marginTop: "3rem", marginBottom: "1rem" }}>One-Up Pairs</h2>
      {primitiveTokens.fluidSpaces.map(({ token, label }) => (
        <SpaceExample key={token} token={token} label={label} />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem" }}>Size Primitives</h1>

      <h2 style={{ marginBottom: "1rem" }}>Border Widths</h2>
      <div style={{ marginBottom: "2rem" }}>
        {primitiveTokens.borders.map(({ token, label }) => (
          <div key={token} style={{ marginBottom: "0.75rem" }}>
            <div style={{ marginBottom: "0.25rem" }}>
              <strong>{label}</strong>{" "}
              <code style={{ color: "#666" }}>{token}</code>
            </div>
            <div
              style={{
                width: "200px",
                height: "50px",
                border: `var(${token}) solid #4f46e5`,
              }}
            />
          </div>
        ))}
      </div>

      <h2 style={{ marginBottom: "1rem" }}>Border Radii</h2>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "2rem",
        }}
      >
        {primitiveTokens.radii.map(({ token, label }) => (
          <div key={token}>
            <div style={{ marginBottom: "0.5rem" }}>
              <strong>{label}</strong>
              <br />
              <code style={{ fontSize: "0.875rem", color: "#666" }}>
                {token}
              </code>
            </div>
            <div
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#4f46e5",
                borderRadius: `var(${token})`,
              }}
            />
          </div>
        ))}
      </div>

      <h2 style={{ marginBottom: "1rem" }}>Icon Sizes</h2>
      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
        {primitiveTokens.icons.map(({ token, label }) => (
          <div key={token} style={{ textAlign: "center" }}>
            <div
              style={{
                width: `var(${token})`,
                height: `var(${token})`,
                backgroundColor: "#4f46e5",
                borderRadius: "0.25rem",
                marginBottom: "0.5rem",
              }}
            />
            <div style={{ fontSize: "0.875rem" }}>
              <strong>{label}</strong>
              <br />
              <code style={{ fontSize: "0.75rem", color: "#666" }}>
                {token}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Shadows: Story = {
  render: () => (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem" }}>Shadow Primitives</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "2rem",
        }}
      >
        {primitiveTokens.shadows.map(({ token, label }) => (
          <div key={token}>
            <div style={{ marginBottom: "1rem" }}>
              <strong>{label}</strong>
              <br />
              <code style={{ fontSize: "0.875rem", color: "#666" }}>
                {token}
              </code>
            </div>
            <div
              style={{
                width: "100%",
                height: "120px",
                backgroundColor: "white",
                borderRadius: "0.5rem",
                boxShadow: `var(${token})`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Animation: Story = {
  render: () => (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem" }}>Animation Primitives</h1>

      <h2 style={{ marginBottom: "1rem" }}>Durations</h2>
      <div style={{ marginBottom: "3rem" }}>
        {primitiveTokens.durations.map(({ token, label }) => (
          <div key={token} style={{ marginBottom: "1rem" }}>
            <div style={{ marginBottom: "0.5rem" }}>
              <strong>{label}</strong>{" "}
              <code style={{ color: "#666" }}>{token}</code>
            </div>
            <div
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: "#4f46e5",
                borderRadius: "0.25rem",
                animation: `pulse var(${token}) infinite`,
              }}
            />
          </div>
        ))}
      </div>

      <h2 style={{ marginBottom: "1rem" }}>Easing Curves</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {primitiveTokens.easings.map(({ token, label }) => (
          <div key={token} style={{ textAlign: "center" }}>
            <div style={{ marginBottom: "0.5rem" }}>
              <strong>{label}</strong>
              <br />
              <code style={{ fontSize: "0.875rem", color: "#666" }}>
                {token}
              </code>
            </div>
            <div
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: "#4f46e5",
                borderRadius: "0.25rem",
                margin: "0 auto",
                animation: `slide 2s var(${token}) infinite`,
              }}
            />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes slide {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(100px); }
        }
      `}</style>
    </div>
  ),
};

export const ZIndex: Story = {
  render: () => (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem" }}>Z-Index Primitives</h1>

      <div
        style={{
          position: "relative",
          height: "400px",
          backgroundColor: "#f3f4f6",
          borderRadius: "0.5rem",
          overflow: "hidden",
        }}
      >
        {primitiveTokens.zIndex.map(({ token, label }, index) => {
          const colors = [
            "#ef4444",
            "#f59e0b",
            "#10b981",
            "#3b82f6",
            "#6366f1",
            "#8b5cf6",
            "#ec4899",
            "#f43f5e",
            "#14b8a6",
            "#06b6d4",
          ];
          const color = colors[index % colors.length];
          return (
            <div
              key={token}
              style={{
                position: "absolute",
                top: `${20 + index * 30}px`,
                left: `${20 + index * 30}px`,
                padding: "1rem",
                backgroundColor: color,
                color: "white",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                zIndex: `var(${token})`,
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              <div>{label}</div>
              <code style={{ fontSize: "0.75rem", opacity: 0.9 }}>{token}</code>
            </div>
          );
        })}
      </div>
    </div>
  ),
};
