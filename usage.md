# Using Duality

![Duality](duality.svg)

## Quick start

```bash
pnpm add @astrabound/duality
```

```tsx
import { ThemeProvider, Button } from "@astrabound/duality";
import "@astrabound/duality/styles.css";

export function App() {
  return (
    <ThemeProvider defaultTheme="classic">
      <Button>Get started</Button>
    </ThemeProvider>
  );
}
```

## Documentation

Full component documentation, guides, and interactive examples are available in the **Storybook**:

- **[Live Storybook](https://duality-storybook.onrender.com)** — hosted on Render
- **Local development**: `pnpm dev` (runs at `http://localhost:6006`)

## What you'll find

- **Foundations** — the two-color model, available palettes, and contrast ratios
- **Components** — 50+ form, layout, display, and navigation components
- **Guides** — accessibility practices, theming and density control, two-color patterns
- **Examples** — copy-paste demo pages (Dashboard, Settings, Checkout, etc.)

## Core concepts

### Two colors, no hue variants

- `--fg` (foreground) and `--bg` (background) are the only colors
- No grays, no tertiary colors, no opacity for muting
- Every palette meets WCAG AAA contrast (7:1)

### State without color

- **Hover / Active**: inverted pair (`--bg` on `--fg`)
- **Disabled**: texture fill (dither or hatch) + legible label
- **Focus**: outline ring on any interactive element
- **Density**: compact or comfortable spacing scale

### Form fields are wired

`FormField` automatically wires `id`, `aria-describedby`, `aria-invalid`, and `aria-errormessage` to its child control. This keeps your form markup lean:

```tsx
<FormField
  label="Email"
  hint="We'll use this to send your confirmation."
  error={submitted && !valid ? "Invalid email" : undefined}
  required
>
  <Input type="email" placeholder="you@example.com" />
</FormField>
```

### Overlays are controlled

Modal, Drawer, ConfirmDialog, and CommandPalette use an `isOpen` / `onClose` pair. The `useDisclosure` hook is the ergonomic wrapper:

```tsx
const { isOpen, open, close } = useDisclosure();
```

## Themes

Built-in themes: `classic`, `dark`, `paper`, `slate`, `sepia`, `amber`, `phosphor`, `blueprint`, `teal`, `sakura`.

Use `PaletteSelect` for a runtime picker:

```tsx
<ThemeProvider defaultTheme="classic" storageKey="myapp">
  <PaletteSelect />
  {/* app */}
</ThemeProvider>
```

## More

- **[GitHub](https://github.com/astrabound/duality)** — source code and issues
- **[README](./README.md)** — project overview and contributor guide
- **[AGENTS.md](./AGENTS.md)** — hard constraints and developer conventions
