/**
 * WCAG contrast helpers. Because Duality only ever renders two colors, every
 * palette must guarantee those two colors are legible against each other. We
 * hold palettes to WCAG AAA (>= 7:1) since color can never be a fallback here.
 */

/** WCAG AAA minimum contrast ratio for normal text. */
export const AAA_CONTRAST = 7;

type Rgb = { r: number; g: number; b: number };

function parseHex(hex: string): Rgb {
  let value = hex.trim().replace(/^#/, "");

  if (value.length === 3) {
    value = value
      .split("")
      .map((c) => c + c)
      .join("");
  }

  if (value.length !== 6 || /[^0-9a-f]/i.test(value)) {
    throw new Error(`Invalid hex color: "${hex}"`);
  }

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function channelLuminance(channel8bit: number): number {
  const c = channel8bit / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** Relative luminance per WCAG 2.x. */
export function relativeLuminance(hex: string): number {
  const { r, g, b } = parseHex(hex);
  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  );
}

/** Contrast ratio between two colors, from 1:1 to 21:1. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Whether a color pair meets WCAG AAA for normal text. */
export function meetsAAA(a: string, b: string): boolean {
  return contrastRatio(a, b) >= AAA_CONTRAST;
}
