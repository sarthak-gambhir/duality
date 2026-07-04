import { describe, expect, it } from "vitest";
import { palettes, paletteNames } from "../src/theme/palettes";
import {
  AAA_CONTRAST,
  contrastRatio,
  meetsAAA,
  relativeLuminance,
} from "../src/theme/contrast";

describe("contrast math", () => {
  it("computes 21:1 for black on white", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 0);
  });

  it("computes 1:1 for identical colors", () => {
    expect(contrastRatio("#123456", "#123456")).toBeCloseTo(1, 5);
  });

  it("is order-independent", () => {
    expect(contrastRatio("#000", "#fff")).toBeCloseTo(
      contrastRatio("#fff", "#000"),
      5,
    );
  });

  it("accepts shorthand hex", () => {
    expect(relativeLuminance("#fff")).toBeCloseTo(
      relativeLuminance("#ffffff"),
      5,
    );
  });

  it("rejects invalid hex", () => {
    expect(() => relativeLuminance("nope")).toThrow();
  });
});

describe("every palette meets WCAG AAA", () => {
  it.each(paletteNames)('palette "%s" has >= 7:1 contrast', (name) => {
    const { ink, surface } = palettes[name];
    const ratio = contrastRatio(ink, surface);
    expect(ratio).toBeGreaterThanOrEqual(AAA_CONTRAST);
    expect(meetsAAA(ink, surface)).toBe(true);
  });
});
