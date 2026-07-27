# AGENTS.md - working with @duality/ui

Entry point for AI agents. Duality is a strict **two-color** React + TypeScript
component library. Read the hard constraints first - they are non-negotiable and
most mistakes come from violating them.

- **Consumers** (building an app with the package): start at [Setup contract](#setup-contract) and [Consumer recipes](#consumer-recipes).
- **Contributors** (extending this repo): start at [Contributor conventions](#contributor-conventions).

## Hard constraints (never violate)

1. **Two colors only.** Everything resolves to `--fg` (foreground) and `--bg`
   (background). Never introduce a third color, a hue, a gray, or transparency.
   No `rgba()`, no opacity for "muted" text, no shadows for depth.
2. **State is never conveyed by color alone.** Express state with inversion,
   texture (dither/hatch), border-style, marker shape, or an outline - always
   paired with the correct ARIA attribute.
3. **AAA contrast.** Every theme is a hand-tuned pair meeting WCAG AAA (7:1).
   Do not add a theme or color that breaks this; it is verified by
   `test/contrast.test.ts`.
4. **SCSS class names:** `snake_case` with single underscores, `du_` prefixed
   (`du_button`, `du_button_icon`). Enforced by Stylelint.
5. **RTL-safe:** use CSS logical properties only (`inline-size`,
   `inset-inline-start`, `border-block-end`, `padding-inline`) - never `width`,
   `left`, `margin-left`, etc.
6. **Tokens, not literals:** use the spacing/sizing/icon/font tokens and the
   shared mixins (see [docs/foundations.md](docs/foundations.md)) instead of raw
   px values or ad-hoc rules.

## Setup contract

Two things are required for anything to render correctly:

```tsx
import { ThemeProvider, Button } from "@duality/ui";
import "@duality/ui/styles.css"; // import the stylesheet exactly once, app-wide

export function App() {
  return (
    <ThemeProvider defaultTheme="classic">
      <Button>Get started</Button>
    </ThemeProvider>
  );
}
```

- Everything must render inside a `ThemeProvider`. It sets `data-theme`,
  `data-density`, and `data-texture` on a `du_theme_root` element that the token
  stylesheet reads.
- The package is **ESM-only**. There is no CommonJS/`require` build.
- Peer deps: `react >= 18`, `react-dom >= 18`.

## Consumer recipes

### Accessible form field

`FormField` wires `id`, `aria-describedby`, `aria-invalid`/`aria-errormessage`,
`aria-required`, and `disabled` onto its child control. Pass a plain child (most
built-in controls consume the wiring via context):

```tsx
import { FormField, Input } from "@duality/ui";

<FormField
  label="Email"
  hint="We'll never share it."
  error={submitted && !valid ? "Enter a valid email" : undefined}
  required
>
  <Input type="email" placeholder="you@example.com" />
</FormField>;
```

For a disabled value control, add a reason - it renders in a persistent caption
linked via `aria-describedby`, and the value stays readable on a `--bg` plate:

```tsx
<FormField label="Workspace" disabled disabledReason="Managed by your admin">
  <Input defaultValue="acme-prod-01" />
</FormField>
```

### Controlled overlay

Trigger-driven overlays (`Modal`, `Drawer`, `ConfirmDialog`, `CommandPalette`)
use an `isOpen` / `onClose` pair; `useDisclosure` is the ergonomic helper:

```tsx
import { Modal, ModalHeader, ModalBody, Button, useDisclosure } from "@duality/ui";

function Example() {
  const { isOpen, open, close } = useDisclosure();
  return (
    <>
      <Button onClick={open}>Edit profile</Button>
      <Modal isOpen={isOpen} onClose={close} aria-labelledby="edit_title">
        <ModalHeader>
          <span id="edit_title">Edit profile</span>
        </ModalHeader>
        <ModalBody>{/* form */}</ModalBody>
      </Modal>
    </>
  );
}
```

Anchored overlays (`Popover`, `Menu`, `Tooltip`) instead take an optional
controlled `open` / `onOpenChange` pair and are uncontrolled by default.

### Themed page with runtime controls

```tsx
import {
  ThemeProvider,
  PaletteSelect,
  DensitySelect,
  TextureSelect,
} from "@duality/ui";

<ThemeProvider
  defaultTheme="phosphor"
  defaultDensity="comfortable"
  defaultTexture="dither"
  storageKey="myapp" // persists the active theme + density to localStorage
>
  <PaletteSelect />
  <DensitySelect />
  <TextureSelect />
  {/* app */}
</ThemeProvider>;
```

## Contributor conventions

### File layout

One folder per component under `src/components/<snake_case_name>/`:

- `PascalCase.tsx` - the component (e.g. `Button.tsx`).
- `snake_case.scss` - its styles (e.g. `button.scss`), imported by
  `src/index.scss`.
- Public exports are re-exported from [src/index.ts](src/index.ts). Anything not
  re-exported there is private.
- Stories live in `stories/<category>/<Name>.stories.tsx`; tests in
  `test/<Name>.test.tsx`.

### Styling

- Author plain SCSS (no CSS modules). Compose with the shared mixins in
  [src/styles/mixins.scss](src/styles/mixins.scss) and the tokens in
  [src/tokens/tokens.scss](src/tokens/tokens.scss). Both are catalogued in
  [docs/foundations.md](docs/foundations.md).
- Disabled state: selection/action controls use
  `@include m.du_texture_fill; @include m.du_text_outline(2);`; value-entry
  controls use `@include m.du_disabled_field;` (texture fill + `--bg` stroke
  plate so the value stays legible).
- Focus: use `du_focus` (or `du_focus_inset` on edge-filled surfaces); never
  leave a bare browser outline on grouped inner inputs.

### Icons

Icons come from a central registry ([src/components/icon/icons.ts](src/components/icon/icons.ts))
rendered through `<Icon>`. Use a semantic slot (`icons.close`, `icons.star`)
resolved via `useIcons()` rather than importing from `react-icons` directly in a
component. Consumers can override any slot with `IconsProvider`.

### Commands

```bash
pnpm dev              # Storybook (dev + docs)
pnpm typecheck        # tsc --noEmit
pnpm lint             # ESLint + Stylelint (du_ snake_case)
pnpm test             # Vitest + Testing Library
pnpm build            # dist/index.js + dist/duality.css
pnpm build:storybook  # static docs build
pnpm docs:gen         # regenerate the component reference + llms.txt
```

Before finishing a change: `pnpm typecheck && pnpm lint && pnpm test`, and
`pnpm docs:gen` if you changed a public component's props.

## Where things live

| Need | Location |
| --- | --- |
| Public API surface | [src/index.ts](src/index.ts) |
| Component source | `src/components/<name>/` |
| Tokens (spacing/size/icon/font/border) | [src/tokens/tokens.scss](src/tokens/tokens.scss), [docs/foundations.md](docs/foundations.md) |
| Shared SCSS mixins | [src/styles/mixins.scss](src/styles/mixins.scss), [docs/foundations.md](docs/foundations.md) |
| Icon registry | [src/components/icon/icons.ts](src/components/icon/icons.ts) |
| Generated component/props reference | [llms.txt](llms.txt), `docs/components/` |
| Concept guides | `stories/guides/*.mdx` (Two-Color Patterns, Accessibility, Theming and Density) |
| Copy-paste example pages | `stories/examples/` |
| Human overview | [README.md](README.md) |
