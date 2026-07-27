import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { palettes } from "../src/theme/palettes";

const here = dirname(fileURLToPath(import.meta.url));
const tokensPath = resolve(here, "../src/tokens/tokens.scss");

/** Parse the `$palettes` Sass map into `{ name: [fg, bg] }`. */
function parseScssPalettes(scss: string): Record<string, [string, string]> {
  const start = scss.indexOf("$palettes: (");
  if (start < 0) throw new Error("Could not find $palettes map in tokens.scss");
  const end = scss.indexOf(");", start);
  const block = scss.slice(start, end);

  const entry =
    /"([\w-]+)":\s*\(\s*(#[0-9a-fA-F]{3,8})\s*,\s*(#[0-9a-fA-F]{3,8})\s*,?\s*\)/g;
  const result: Record<string, [string, string]> = {};
  let match: RegExpExecArray | null;
  while ((match = entry.exec(block)) !== null) {
    result[match[1]!] = [match[2]!.toLowerCase(), match[3]!.toLowerCase()];
  }
  return result;
}

describe("palette parity (palettes.ts vs tokens.scss)", () => {
  const scss = readFileSync(tokensPath, "utf8");
  const scssPalettes = parseScssPalettes(scss);

  it("defines the same set of theme names", () => {
    expect(Object.keys(scssPalettes).sort()).toEqual(
      Object.keys(palettes).sort(),
    );
  });

  it.each(Object.keys(palettes))(
    'theme "%s" has matching fg/bg hex in both sources',
    (name) => {
      const ts = palettes[name as keyof typeof palettes];
      const scssPair = scssPalettes[name];
      expect(scssPair).toBeDefined();
      expect([ts.fg.toLowerCase(), ts.bg.toLowerCase()]).toEqual(scssPair);
    },
  );
});
