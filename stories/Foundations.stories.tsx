import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { palettes, paletteNames, contrastRatio, meetsAAA } from "../src";

/**
 * Foundations: the two-color model. Everything Duality renders resolves to
 * exactly `--fg` and `--bg`. Use the "Palette" and "Invert" toolbar controls
 * (top of the canvas) to see the current story under any palette.
 */
const meta: Meta = {
  title: "Foundations/Two-Color Model",
};

export default meta;
type Story = StoryObj;

const swatch = (bg: string, fg: string): CSSProperties => ({
  background: bg,
  color: fg,
  border: "var(--border-width) solid var(--fg)",
  padding: "var(--space-4)",
  minWidth: 160,
});

export const CurrentPalette: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
      <div style={swatch("var(--bg)", "var(--fg)")}>
        <strong>--fg on --bg</strong>
        <p>Base surface.</p>
      </div>
      <div style={swatch("var(--fg)", "var(--bg)")}>
        <strong>--bg on --fg</strong>
        <p>Inverted (hover / selected).</p>
      </div>
    </div>
  ),
};

export const AllPalettes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      {paletteNames.map((name) => {
        const { ink, surface, label } = palettes[name];
        const ratio = contrastRatio(ink, surface).toFixed(2);
        return (
          <div
            key={name}
            data-theme={name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-4)",
              background: surface,
              color: ink,
              border: `2px solid ${ink}`,
              padding: "var(--space-4)",
            }}
          >
            <strong style={{ minWidth: 120 }}>{label}</strong>
            <code>
              {ink} / {surface}
            </code>
            <span>
              contrast {ratio}:1{" "}
              {meetsAAA(ink, surface) ? "(AAA)" : "(FAILS AAA)"}
            </span>
          </div>
        );
      })}
    </div>
  ),
};
