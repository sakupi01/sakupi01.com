import type { Meta, StoryObj } from "@storybook/react";
import "../css/tokens/semantic.css";
import "../css/tokens/primitives.css";
import { semanticTokens } from "./parse-tokens";

const meta = {
  title: "Design Tokens/Semantic",
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
        width: "80px",
        height: "80px",
        backgroundColor: `var(${token})`,
        border: "1px solid #ccc",
        borderRadius: "4px",
      }}
    />
    <div>
      <div style={{ fontWeight: "600", fontSize: "0.875rem" }}>{label}</div>
      <code style={{ fontSize: "0.75rem", color: "#666" }}>{token}</code>
    </div>
  </div>
);

const TextSample = ({ token, label }: { token: string; label: string }) => (
  <div style={{ marginBottom: "1rem" }}>
    <div
      style={{
        fontSize: "0.875rem",
        fontWeight: "600",
        marginBottom: "0.25rem",
      }}
    >
      {label}
    </div>
    <div style={{ color: `var(${token})`, fontSize: "1rem" }}>
      Sample text using {token}
    </div>
    <code style={{ fontSize: "0.75rem", color: "#666" }}>{token}</code>
  </div>
);

export const ColorsSurfaces: Story = {
  render: () => (
    <div style={{ padding: "2rem", maxWidth: "1200px" }}>
      <h1 style={{ marginBottom: "2rem" }}>
        Semantic Colors: Surfaces & Backgrounds
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Main Surfaces</h2>
          <ColorSwatch token="--s-color-surface-base" label="Base Surface" />
          <ColorSwatch
            token="--s-color-surface-raised"
            label="Raised Surface"
          />
          <ColorSwatch
            token="--s-color-surface-overlay"
            label="Overlay Surface"
          />
        </div>
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Interactive Surfaces</h2>
          <ColorSwatch
            token="--s-color-surface-interactive"
            label="Interactive"
          />
          <ColorSwatch
            token="--s-color-surface-interactive-hover"
            label="Interactive Hover"
          />
        </div>
      </div>
    </div>
  ),
};

export const ColorsText: Story = {
  render: () => (
    <div style={{ padding: "2rem", maxWidth: "1200px" }}>
      <h1 style={{ marginBottom: "2rem" }}>Semantic Colors: Text</h1>
      <TextSample token="--s-color-text-primary" label="Primary Text" />
      <TextSample token="--s-color-text-secondary" label="Secondary Text" />
      <TextSample token="--s-color-text-tertiary" label="Tertiary Text" />
      <TextSample token="--s-color-text-disabled" label="Disabled Text" />
      <TextSample token="--s-color-text-inverse" label="Inverse Text" />
    </div>
  ),
};

export const ColorsInteractive: Story = {
  render: () => (
    <div style={{ padding: "2rem", maxWidth: "1200px" }}>
      <h1 style={{ marginBottom: "2rem" }}>Semantic Colors: Interactive</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Primary</h2>
          <ColorSwatch token="--s-color-primary" label="Primary" />
          <ColorSwatch token="--s-color-primary-hover" label="Primary Hover" />
          <ColorSwatch
            token="--s-color-primary-active"
            label="Primary Active"
          />
        </div>
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Links</h2>
          <ColorSwatch token="--s-color-link" label="Link" />
          <ColorSwatch token="--s-color-link-hover" label="Link Hover" />
          <ColorSwatch token="--s-color-link-visited" label="Link Visited" />
        </div>
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Focus</h2>
          <ColorSwatch token="--s-color-focus" label="Focus" />
        </div>
      </div>
    </div>
  ),
};

export const ColorsFeedback: Story = {
  render: () => (
    <div style={{ padding: "2rem", maxWidth: "1200px" }}>
      <h1 style={{ marginBottom: "2rem" }}>
        Semantic Colors: Feedback & Status
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "2rem",
        }}
      >
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Message</h2>
          <ColorSwatch token="--s-color-message" label="Message" />
          <ColorSwatch
            token="--s-color-message-bg"
            label="Message Background"
          />
          <ColorSwatch token="--s-color-message-text" label="message Text" />
        </div>
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Warning</h2>
          <ColorSwatch token="--s-color-warning" label="Warning" />
          <ColorSwatch
            token="--s-color-warning-bg"
            label="Warning Background"
          />
          <ColorSwatch token="--s-color-warning-text" label="Warning Text" />
        </div>
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Memo</h2>
          <ColorSwatch token="--s-color-memo" label="Memo" />
          <ColorSwatch token="--s-color-memo-bg" label="Memo Background" />
          <ColorSwatch token="--s-color-memo-text" label="Memo Text" />
        </div>
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Info</h2>
          <ColorSwatch token="--s-color-info" label="Info" />
          <ColorSwatch token="--s-color-info-bg" label="Info Background" />
          <ColorSwatch token="--s-color-info-text" label="Info Text" />
        </div>
      </div>
    </div>
  ),
};

export const ColorsBorders: Story = {
  render: () => (
    <div style={{ padding: "2rem", maxWidth: "1200px" }}>
      <h1 style={{ marginBottom: "2rem" }}>Semantic Colors: Borders</h1>
      <ColorSwatch token="--s-color-border-subtle" label="Subtle Border" />
      <ColorSwatch token="--s-color-border-default" label="Default Border" />
      <ColorSwatch token="--s-color-border-strong" label="Strong Border" />
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div style={{ padding: "2rem", maxWidth: "1200px" }}>
      <h1 style={{ marginBottom: "2rem" }}>Semantic Typography</h1>
      <div style={{ display: "grid", gap: "3rem" }}>
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Font Sizes</h2>
          <div style={{ fontSize: "var(--s-font-size-xs)" }}>
            XS: The quick brown fox (--s-font-size-xs)
          </div>
          <div style={{ fontSize: "var(--s-font-size-sm)" }}>
            SM: The quick brown fox (--s-font-size-sm)
          </div>
          <div style={{ fontSize: "var(--s-font-size-base)" }}>
            Base: The quick brown fox (--s-font-size-base)
          </div>
          <div style={{ fontSize: "var(--s-font-size-lg)" }}>
            LG: The quick brown fox (--s-font-size-lg)
          </div>
          <div style={{ fontSize: "var(--s-font-size-xl)" }}>
            XL: The quick brown fox (--s-font-size-xl)
          </div>
          <div style={{ fontSize: "var(--s-font-size-2xl)" }}>
            2XL: The quick brown fox (--s-font-size-2xl)
          </div>
          <div style={{ fontSize: "var(--s-font-size-3xl)" }}>
            3XL: The quick brown fox (--s-font-size-3xl)
          </div>
        </div>
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Heading Sizes</h2>
          <h1
            style={{
              fontSize: "var(--s-font-size-h1)",
              lineHeight: "var(--s-line-height-h1)",
            }}
          >
            H1 Heading (--s-font-size-h1)
          </h1>
          <h2
            style={{
              fontSize: "var(--s-font-size-h2)",
              lineHeight: "var(--s-line-height-h2)",
            }}
          >
            H2 Heading (--s-font-size-h2)
          </h2>
          <h3
            style={{
              fontSize: "var(--s-font-size-h3)",
              lineHeight: "var(--s-line-height-h3)",
            }}
          >
            H3 Heading (--s-font-size-h3)
          </h3>
          <h4
            style={{
              fontSize: "var(--s-font-size-h4)",
              lineHeight: "var(--s-line-height-h4)",
            }}
          >
            H4 Heading (--s-font-size-h4)
          </h4>
          <h5
            style={{
              fontSize: "var(--s-font-size-h5)",
              lineHeight: "var(--s-line-height-h5)",
            }}
          >
            H5 Heading (--s-font-size-h5)
          </h5>
          <h6
            style={{
              fontSize: "var(--s-font-size-h6)",
              lineHeight: "var(--s-line-height-h6)",
            }}
          >
            H6 Heading (--s-font-size-h6)
          </h6>
        </div>
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Font Weights</h2>
          <div style={{ fontWeight: "var(--s-font-weight-normal)" }}>
            Normal Weight (--s-font-weight-normal)
          </div>
          <div style={{ fontWeight: "var(--s-font-weight-medium)" }}>
            Medium Weight (--s-font-weight-medium)
          </div>
          <div style={{ fontWeight: "var(--s-font-weight-semibold)" }}>
            Semibold Weight (--s-font-weight-semibold)
          </div>
          <div style={{ fontWeight: "var(--s-font-weight-bold)" }}>
            Bold Weight (--s-font-weight-bold)
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div style={{ padding: "2rem", maxWidth: "1200px" }}>
      <h1 style={{ marginBottom: "2rem" }}>Semantic Spacing</h1>
      <div style={{ display: "grid", gap: "3rem" }}>
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Layout Gaps (Fixed)</h2>
          {semanticTokens.gaps.map(({ token }) => (
            <div key={token} style={{ marginBottom: "1rem" }}>
              <code
                style={{
                  fontSize: "0.875rem",
                  marginBottom: "0.5rem",
                  display: "block",
                }}
              >
                {token}
              </code>
              <div
                style={{
                  display: "flex",
                  gap: `var(${token})`,
                  padding: "0.5rem",
                  backgroundColor: "#f0f0f0",
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "#4299e1",
                  }}
                />
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "#4299e1",
                  }}
                />
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "#4299e1",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Layout Gaps (Fluid)</h2>
          {semanticTokens.fluidGaps.map(({ token }) => (
            <div key={token} style={{ marginBottom: "1rem" }}>
              <code
                style={{
                  fontSize: "0.875rem",
                  marginBottom: "0.5rem",
                  display: "block",
                }}
              >
                {token}
              </code>
              <div
                style={{
                  display: "flex",
                  gap: `var(${token})`,
                  padding: "0.5rem",
                  backgroundColor: "#f0f0f0",
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "#48bb78",
                  }}
                />
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "#48bb78",
                  }}
                />
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "#48bb78",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Gutters</h2>
          {semanticTokens.gutters.map(({ token }) => (
            <div key={token} style={{ marginBottom: "1rem" }}>
              <code style={{ fontSize: "0.875rem" }}>{token}</code>
              <div
                style={{
                  padding: `var(${token})`,
                  backgroundColor: "#fbd38d",
                  marginTop: "0.5rem",
                }}
              >
                <div style={{ backgroundColor: "white", padding: "0.5rem" }}>
                  Content with gutter padding
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const Sizing: Story = {
  render: () => (
    <div style={{ padding: "2rem", maxWidth: "1200px" }}>
      <h1 style={{ marginBottom: "2rem" }}>Semantic Sizing</h1>
      <div style={{ display: "grid", gap: "3rem" }}>
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Border Widths</h2>
          <div style={{ marginBottom: "1rem" }}>
            <code style={{ fontSize: "0.875rem" }}>--s-border-width-thin</code>
            <div
              style={{
                marginTop: "0.5rem",
                borderTop: "var(--s-border-width-thin) solid #333",
                width: "200px",
              }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <code style={{ fontSize: "0.875rem" }}>--s-border-width-base</code>
            <div
              style={{
                marginTop: "0.5rem",
                borderTop: "var(--s-border-width-base) solid #333",
                width: "200px",
              }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <code style={{ fontSize: "0.875rem" }}>--s-border-width-thick</code>
            <div
              style={{
                marginTop: "0.5rem",
                borderTop: "var(--s-border-width-thick) solid #333",
                width: "200px",
              }}
            />
          </div>
        </div>
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Border Radius</h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {semanticTokens.borderRadii.map(({ token }) => (
              <div key={token} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#4299e1",
                    borderRadius: `var(${token})`,
                    marginBottom: "0.5rem",
                  }}
                />
                <code style={{ fontSize: "0.75rem" }}>{token}</code>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Icon Sizes</h2>
          <div style={{ display: "flex", gap: "2rem", alignItems: "flex-end" }}>
            {semanticTokens.iconSizes.map(({ token }) => (
              <div key={token} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: `var(${token})`,
                    height: `var(${token})`,
                    backgroundColor: "#ed8936",
                    marginBottom: "0.5rem",
                  }}
                />
                <code style={{ fontSize: "0.75rem" }}>{token}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Animations: Story = {
  render: () => (
    <div style={{ padding: "2rem", maxWidth: "1200px" }}>
      <h1 style={{ marginBottom: "2rem" }}>Semantic Animations</h1>
      <div style={{ display: "grid", gap: "3rem" }}>
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Durations</h2>
          {semanticTokens.durations.map(({ token }) => {
            const name = token.replace("--s-duration-", "");
            return (
              <div key={token} style={{ marginBottom: "1rem" }}>
                <code style={{ fontSize: "0.875rem", marginRight: "1rem" }}>
                  {token}
                </code>
                <div
                  style={{
                    width: "100px",
                    height: "40px",
                    backgroundColor: "#4299e1",
                    marginTop: "0.5rem",
                    animation: `slide-${name} var(${token}) ease-in-out infinite alternate`,
                  }}
                />
                <style>{`
                  @keyframes slide-${name} {
                    from { transform: translateX(0); }
                    to { transform: translateX(200px); }
                  }
                `}</style>
              </div>
            );
          })}
        </div>
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Composite Transitions</h2>
          {semanticTokens.transitions.map(({ token }) => (
            <div key={token} style={{ marginBottom: "1rem" }}>
              <code style={{ fontSize: "0.875rem" }}>{token}</code>
              <div
                style={{
                  width: "100px",
                  height: "40px",
                  backgroundColor: "#48bb78",
                  marginTop: "0.5rem",
                  cursor: "pointer",
                  transition: `transform var(${token})`,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateX(100px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateX(0)")
                }
              >
                Hover me
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const Effects: Story = {
  render: () => (
    <div style={{ padding: "2rem", maxWidth: "1200px" }}>
      <h1 style={{ marginBottom: "2rem" }}>Semantic Effects</h1>
      <div style={{ display: "grid", gap: "3rem" }}>
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Shadows</h2>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            {semanticTokens.shadows.map(({ token }) => (
              <div key={token} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    backgroundColor: "white",
                    boxShadow: `var(${token})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  Shadow
                </div>
                <code style={{ fontSize: "0.75rem" }}>{token}</code>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Focus Ring</h2>
          <button
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "var(--s-color-primary)",
              color: "white",
              border: "none",
              borderRadius: "var(--s-border-radius-md)",
              cursor: "pointer",
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = "var(--s-focus-outline)";
              e.currentTarget.style.outlineOffset =
                "var(--s-focus-ring-offset)";
              e.currentTarget.style.boxShadow = "var(--s-focus-shadow)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Focus me (Tab key)
          </button>
          <div
            style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#666" }}
          >
            <code>--s-focus-ring-width</code>, <code>--s-focus-ring-color</code>
            , <code>--s-focus-ring-offset</code>
          </div>
        </div>
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Interactive States</h2>
          <div style={{ display: "flex", gap: "2rem" }}>
            <div>
              <div style={{ marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                Hover Opacity
              </div>
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  backgroundColor: "#4299e1",
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.opacity = "var(--s-hover-opacity)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Hover
              </div>
              <code
                style={{
                  fontSize: "0.75rem",
                  display: "block",
                  marginTop: "0.5rem",
                }}
              >
                --s-hover-opacity
              </code>
            </div>
            <div>
              <div style={{ marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                Active Scale
              </div>
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  backgroundColor: "#48bb78",
                  cursor: "pointer",
                  transition: "transform 0.1s",
                }}
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform =
                    "scale(var(--s-active-scale))")
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                Click
              </div>
              <code
                style={{
                  fontSize: "0.75rem",
                  display: "block",
                  marginTop: "0.5rem",
                }}
              >
                --s-active-scale
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Layout: Story = {
  render: () => (
    <div style={{ padding: "2rem", maxWidth: "1200px" }}>
      <h1 style={{ marginBottom: "2rem" }}>Semantic Layout</h1>
      <div style={{ display: "grid", gap: "3rem" }}>
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Z-Index Scale</h2>
          <div
            style={{
              position: "relative",
              height: "300px",
              backgroundColor: "#f0f0f0",
            }}
          >
            {semanticTokens.zIndex.map(({ token, label }, index) => {
              const offset = index * 20;
              return (
                <div
                  key={token}
                  style={{
                    position: "absolute",
                    left: `${offset}px`,
                    top: `${offset}px`,
                    width: "150px",
                    height: "80px",
                    backgroundColor: "#4299e1",
                    color: "white",
                    padding: "0.5rem",
                    zIndex: `var(${token})`,
                    fontSize: "0.75rem",
                    border: "2px solid white",
                  }}
                >
                  <div style={{ fontWeight: "600" }}>{label}</div>
                  <code style={{ fontSize: "0.625rem", color: "#e2e8f0" }}>
                    {token}
                  </code>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Container Widths</h2>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {semanticTokens.containers.map(({ token }) => {
              const isReadable = token.includes("readable");

              if (isReadable) {
                return (
                  <div key={token}>
                    <code
                      style={{ fontSize: "0.75rem", marginRight: "0.5rem" }}
                    >
                      {token}
                    </code>
                    <div
                      style={{
                        maxWidth: `var(${token})`,
                        backgroundColor: "#ed8936",
                        padding: "1rem",
                        marginTop: "0.25rem",
                      }}
                    >
                      <p style={{ margin: 0 }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Optimal line length for readability is around 65
                        characters. This container is limited to that width
                        using {token}.
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div key={token}>
                  <code style={{ fontSize: "0.75rem", marginRight: "0.5rem" }}>
                    {token}
                  </code>
                  <div
                    style={{
                      maxWidth: `var(${token})`,
                      height: "30px",
                      backgroundColor: "#9f7aea",
                      marginTop: "0.25rem",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  ),
};
