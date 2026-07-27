// Generates the machine-readable component reference (docs/components/*.md) and
// the llms.txt index from the exported components' TypeScript + JSDoc.
//
//   node scripts/gen-docs.mjs           # write the reference
//   node scripts/gen-docs.mjs --check   # fail (exit 1) if the reference is stale
//
// Props are extracted with react-docgen-typescript. Only props declared in this
// repo are kept (inherited DOM/React props are filtered out) so tables stay
// focused on each component's own API. Output is fully sorted/deterministic so
// `--check` can diff it in CI.

import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import prettier from "prettier";
import reactDocgen from "react-docgen-typescript";

const root = path.resolve(url.fileURLToPath(new URL("..", import.meta.url)));
const componentsDir = path.join(root, "src", "components");
const themeDir = path.join(root, "src", "theme");
const outDir = path.join(root, "docs", "components");
const indexPath = path.join(root, "src", "index.ts");
const tsconfigPath = path.join(root, "tsconfig.json");
const check = process.argv.includes("--check");

// Polymorphic components: react-docgen can't meaningfully describe the `as`
// prop, so we filter it out (below) and add a standard note instead.
const POLYMORPHIC = new Set([
  "Box",
  "Text",
  "Card",
  "Stack",
  "Inline",
  "Grid",
  "Container",
  "Divider",
]);

// -- 1. Public API surface: only document what src/index.ts exports. ----------
const indexSrc = fs.readFileSync(indexPath, "utf8");
const exported = new Set();
for (const m of indexSrc.matchAll(/export\s+(?:type\s+)?\{([^}]*)\}/g)) {
  for (const raw of m[1].split(",")) {
    const part = raw.trim();
    if (!part) continue;
    const asMatch = part.match(/\bas\s+(\w+)\s*$/);
    exported.add(asMatch ? asMatch[1] : part.split(/\s+as\s+/)[0].trim());
  }
}

// -- 2. Collect component source files (PascalCase .tsx). ---------------------
function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (/^[A-Z][A-Za-z0-9]*\.tsx$/.test(entry.name)) out.push(p);
  }
  return out;
}
const files = [...walk(componentsDir), ...walk(themeDir)];

// -- 3. Parse props (repo-declared props only). -------------------------------
const parser = reactDocgen.withCustomConfig(tsconfigPath, {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  propFilter: (prop) => {
    if (prop.name === "as" || prop.name === "ref" || prop.name === "key")
      return false;
    if (prop.parent) return !prop.parent.fileName.includes("node_modules");
    return true;
  },
});

const parsed = parser.parse(files);

// -- 4. Build one entry per exported component. -------------------------------
function esc(value) {
  return String(value ?? "")
    .replace(/\r?\n+/g, " ")
    .replace(/\|/g, "\\|")
    .trim();
}

// Wrap content as an inline code span that is safe inside a table cell even when
// the content itself contains backticks (e.g. template-literal defaults). The
// fence must be longer than any backtick run inside, with padding when the
// content starts or ends with a backtick (CommonMark rules).
function code(value) {
  const s = esc(value);
  if (!s) return "-";
  const longestRun = Math.max(0, ...(s.match(/`+/g) ?? []).map((r) => r.length));
  const fence = "`".repeat(longestRun + 1);
  const pad = s.startsWith("`") || s.endsWith("`") ? " " : "";
  return `${fence}${pad}${s}${pad}${fence}`;
}

function firstSentence(text) {
  const clean = esc(text);
  const dot = clean.indexOf(". ");
  const s = dot === -1 ? clean : clean.slice(0, dot + 1);
  return s.length > 160 ? `${s.slice(0, 157)}...` : s;
}

// react-docgen reports union types as "enum"; expand small unions to their
// literal values so agents can see the allowed options (e.g. "sm" | "md" | "lg").
function typeName(type) {
  if (!type) return "unknown";
  if (type.name === "enum" && Array.isArray(type.value)) {
    const values = [
      ...new Set(
        type.value.map((v) => String(v.value)).filter((v) => v !== "undefined"),
      ),
    ];
    if (values.length && values.length <= 12) return values.join(" | ");
  }
  return type.name;
}

function renderComponent(doc) {
  const lines = [`# ${doc.displayName}`, ""];
  if (doc.description) lines.push(esc(doc.description), "");
  if (POLYMORPHIC.has(doc.displayName)) {
    lines.push(
      "Polymorphic: also accepts an `as` prop to change the rendered element, plus that element's native props.",
      "",
    );
  }

  const props = Object.values(doc.props ?? {}).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  if (props.length) {
    lines.push(
      "## Props",
      "",
      "| Prop | Type | Default | Description |",
      "| --- | --- | --- | --- |",
    );
    for (const p of props) {
      const type = code(typeName(p.type));
      const def =
        p.defaultValue && p.defaultValue.value != null
          ? code(p.defaultValue.value)
          : "-";
      const name = `${code(p.name)}${p.required ? " (required)" : ""}`;
      lines.push(`| ${name} | ${type} | ${def} | ${esc(p.description)} |`);
    }
    lines.push("");
  } else {
    lines.push("_No component-specific props (wraps native element props)._", "");
  }
  return `${lines.join("\n").trimEnd()}\n`;
}

// Format generated markdown through the repo's Prettier config so the output
// matches what an editor/`pnpm format` would produce - otherwise a reflow of
// the tables would make `docs:check` perpetually stale.
const prettierConfig = (await prettier.resolveConfig(root)) ?? {};
const formatMd = (content) =>
  prettier.format(content, { ...prettierConfig, parser: "markdown" });

const entries = [];
const seen = new Set();
for (const doc of parsed) {
  if (!doc.displayName || !exported.has(doc.displayName)) continue;
  if (seen.has(doc.displayName)) continue;
  seen.add(doc.displayName);
  entries.push({
    name: doc.displayName,
    summary: firstSentence(doc.description) || "Component.",
    md: await formatMd(renderComponent(doc)),
  });
}
entries.sort((a, b) => a.name.localeCompare(b.name));

// -- 5. Assemble outputs (path relative to repo root -> content). -------------
const outputs = new Map();
for (const e of entries) {
  outputs.set(`docs/components/${e.name}.md`, e.md);
}

const llms = [
  "# Duality (@astrabound/duality)",
  "",
  "> A strict two-color React + TypeScript component library. Everything is drawn with exactly two themeable colors, `--fg` and `--bg`: no third color, hue, or transparency. State is expressed through inversion, texture (dither/hatch), border-style, and marker shape - never color alone. Every theme meets WCAG AAA (7:1).",
  "",
  "## Documentation",
  "",
  "- [Agent guide](AGENTS.md): setup contract, hard constraints, recipes, and contributor conventions.",
  "- [Foundations](docs/foundations.md): design tokens, SCSS mixins, and icon slots.",
  "- [README](README.md): human-facing overview.",
  "",
  "## Components",
  "",
  ...entries.map((e) => `- [${e.name}](docs/components/${e.name}.md): ${e.summary}`),
  "",
].join("\n");
outputs.set("llms.txt", llms);

// -- 6. Write or check. -------------------------------------------------------
function readIfExists(rel) {
  const abs = path.join(root, rel);
  return fs.existsSync(abs) ? fs.readFileSync(abs, "utf8") : null;
}

// Any generated component doc on disk that is no longer produced is an orphan.
const existingDocs = fs.existsSync(outDir)
  ? fs
      .readdirSync(outDir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => `docs/components/${f}`)
  : [];
const orphans = existingDocs.filter((rel) => !outputs.has(rel));

if (check) {
  const problems = [];
  for (const [rel, content] of outputs) {
    if (readIfExists(rel) !== content) problems.push(rel);
  }
  for (const rel of orphans) problems.push(`${rel} (stale, should be removed)`);
  if (problems.length) {
    console.error(
      `Docs are out of date. Run \`pnpm docs:gen\`. Affected:\n  ${problems.join("\n  ")}`,
    );
    process.exit(1);
  }
  console.log(`Docs up to date (${entries.length} components).`);
} else {
  fs.mkdirSync(outDir, { recursive: true });
  for (const [rel, content] of outputs) {
    const abs = path.join(root, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content);
  }
  for (const rel of orphans) fs.rmSync(path.join(root, rel));
  console.log(
    `Generated ${entries.length} component docs + llms.txt${
      orphans.length ? ` (removed ${orphans.length} stale)` : ""
    }.`,
  );
}
