/**
 * Named two-color palettes.
 *
 * Each palette is a pair: `ink` (default foreground) and `surface` (default
 * background). The inversion toggle swaps them at runtime. Color values mirror
 * the `$palettes` map in `src/tokens/tokens.scss` - keep the two in sync.
 *
 * Every pair must meet WCAG AAA; this is verified by the contrast tests.
 */
export interface Palette {
  /** Machine name, used as the `data-theme` value. */
  name: string;
  /** Human-readable label for docs and the Storybook toolbar. */
  label: string;
  /** Default foreground color. */
  ink: string;
  /** Default background color. */
  surface: string;
}

export const palettes = {
  classic: {
    name: "classic",
    label: "Classic",
    ink: "#000000",
    surface: "#ffffff",
  },
  paper: { name: "paper", label: "Paper", ink: "#111111", surface: "#f4f0e6" },
  amber: {
    name: "amber",
    label: "Amber CRT",
    ink: "#ffb000",
    surface: "#0a0a0a",
  },
  phosphor: {
    name: "phosphor",
    label: "Phosphor",
    ink: "#33ff33",
    surface: "#001a00",
  },
  blueprint: {
    name: "blueprint",
    label: "Blueprint",
    ink: "#ffffff",
    surface: "#0a2540",
  },
  sepia: { name: "sepia", label: "Sepia", ink: "#2b2118", surface: "#efe7d8" },
  high_contrast: {
    name: "high_contrast",
    label: "High Contrast",
    ink: "#ffff00",
    surface: "#000000",
  },
} as const satisfies Record<string, Palette>;

export type PaletteName = keyof typeof palettes;

export const paletteNames = Object.keys(palettes) as PaletteName[];

export const defaultPalette: PaletteName = "classic";
