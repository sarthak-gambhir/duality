/**
 * Named two-color themes.
 *
 * Each theme is a single fixed pair of colors - `fg` (foreground) and `bg`
 * (background) - from which `--fg` / `--bg` resolve at runtime. There is no
 * light/dark toggle: light and dark are separate named themes. Component states
 * (hover / selected) still swap the two colors locally.
 *
 * Color values mirror the `$palettes` map in `src/tokens/tokens.scss` - keep
 * the two in sync. Every theme MUST meet WCAG AAA (>= 7:1); this is verified by
 * the contrast tests.
 */

export interface Palette {
  /** Human-readable label for docs and the Storybook toolbar. */
  label: string;
  /** Foreground color (text, borders, filled marks). */
  fg: string;
  /** Background / surface color. */
  bg: string;
}

export const palettes = {
  classic: { label: "Classic", fg: "#141414", bg: "#fcfbff" },
  dark: { label: "Dark", fg: "#f0f0ee", bg: "#0d0d0d" },
  paper: { label: "Paper", fg: "#26221a", bg: "#f0eee7" },
  slate: { label: "Slate", fg: "#ccd2d9", bg: "#242930" },
  sepia: { label: "Sepia", fg: "#55422a", bg: "#fff3c8" },
  amber: { label: "Amber CRT", fg: "#ffc233", bg: "#201b1e" },
  phosphor: { label: "Phosphor", fg: "#2bff43", bg: "#05190b" },
  blueprint: { label: "Blueprint", fg: "#ffffff", bg: "#032b46" },
  teal: { label: "Teal", fg: "#45e0d2", bg: "#04211f" },
  sakura: { label: "Sakura", fg: "#ff9cb4", bg: "#25212b" },
} as const satisfies Record<string, Palette>;

export type PaletteName = keyof typeof palettes;

export const paletteNames = Object.keys(palettes) as PaletteName[];

export const defaultPalette: PaletteName = "classic";
