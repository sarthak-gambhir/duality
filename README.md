# @duality/ui

A strict **two-color** design system. Everything is drawn with exactly two themeable colors (`--fg` and `--bg`) - no intermediate shades, no hue variants, no transparency. Depth and state are expressed through inversion, pixel/dither patterns, and border-style changes.

## Requirements

- Node.js `>= 20`
- pnpm `>= 9`

## Getting started

```bash
pnpm install        # install dependencies
pnpm dev            # run Storybook (dev + docs)
pnpm build          # build the package (dist/index.js + dist/duality.css)
pnpm test           # run the test suite (Vitest)
pnpm lint           # ESLint + Stylelint
```

## Usage

```tsx
import { ThemeProvider } from "@duality/ui";
import "@duality/ui/styles.css";

export function App() {
  return <ThemeProvider defaultTheme="classic">{/* ... */}</ThemeProvider>;
}
```

## Components

All components are drawn with the two-color model: base is `--fg` on `--bg`, hover/selected inverts the pair, focus adds an outline, and disabled uses the active texture fill (dither or hatch) with a legible label. State is never conveyed by color alone. Disabled value controls keep their value readable on a `--bg` stroke plate and can surface a `disabledReason` in a persistent caption below the field.

- **Layout:** `Box` (polymorphic), `Stack`, `Inline`, `Grid`, `Container`, `Divider`
- **Typography:** `Text` (polymorphic), `Heading`, `Link`, `Code`, `Kbd`, `TruncatedText`
- **Icons & brand:** `Icon`, `IconsProvider`, `useIcons`, `Logo`
- **Form controls:** `Button`, `Input`, `Textarea`, `Checkbox`, `Radio` + `RadioGroup`, `Switch`, `Select`, `MultiSelect`, `NumberInput`, `ToggleGroup` (+ `ToggleGroupItem`), `Rating`, `Combobox`, `Slider`, `RangeSlider`, `DatePicker`, `TimePicker`, `TagInput`, `FileUpload`, `PinInput`
- **Form composition:** `Label`, `FormField` (wires `id` / `aria-describedby` / `aria-invalid`)
- **Display:** `Card` (+ `CardHeader` / `CardBody` / `CardFooter` / `CardMedia`), `Badge` (alias `Tag`), `Alert`, `Banner`, `Avatar`, `Progress`, `Spinner`, `Skeleton`, `Stat`, `EmptyState`
- **Data:** `Table` (+ `THead` / `TBody` / `Tr` / `Th` / `Td`), `DataTable` (sortable + filterable), `Tree`, `Timeline`
- **Navigation:** `Breadcrumbs`, `Pagination`, `Stepper`, `SideNav`, `Sidebar` (+ `SidebarHeader` / `SidebarBody` / `SidebarFooter` / `SidebarTrigger`, `useSidebar`)
- **Disclosure:** `Tabs` (+ `TabList` / `Tab` / `TabPanel`), `Accordion` (+ `AccordionItem`)
- **Overlays:** `Modal` (+ sections), `Drawer` (+ sections), `ConfirmDialog`, `Tooltip`, `Popover`, `Menu` (+ `MenuItem` / `MenuSeparator`), `ContextMenu`, `CommandPalette`, `Toast` (`ToastProvider` / `useToast`)
- **Theming:** `PaletteSelect`, `DensitySelect`, `TextureSelect`, and hooks/utilities `useDisclosure`, `Portal`, `useControllableState`, `useFocusTrap`, `useDismiss`, `usePortalContainer`

Theme utilities (`ThemeProvider`, `useTheme`, `palettes`, `contrastRatio`, `meetsAAA`) and the `cx` classname helper are also exported. `ThemeProvider` supports optional `storageKey` persistence. Each component ships a Storybook story, and most components have Vitest + Testing Library coverage. In-depth guides (Accessibility, Theming and Density, Two-Color Patterns) live under **Guides** in Storybook.

Full composed demo pages — Dashboard, Settings, Email, File Manager, Checkout, and a retro Command Center — live under **Examples** in Storybook. Each is built entirely from public exports and doubles as a copy-paste usage reference.

## Theming, density, RTL, and motion

- **Themes:** `ThemeProvider` sets `data-theme` on a `du_theme_root`; the tokens stylesheet resolves `--fg` / `--bg` from the active theme's fixed pair. Light and dark are separate named themes, each hand-tuned (built-ins: `classic`, `dark`, `paper`, `slate`, `sepia`, `amber`, `phosphor`, `blueprint`, `teal`, `sakura`). This is separate from the per-component inversion used for hover/selected states.
- **Density:** `defaultDensity="compact"` (or `useTheme().setDensity`) sets `data-density="compact"`, which applies a tighter spacing/sizing scale. Colors and border widths are unchanged; per-component `size` props are independent.
- **Texture:** `defaultTexture="hatch"` (or `useTheme().setTexture`) sets `data-texture`, which switches the two-color fill pattern between `dither` (default checkerboard) and `hatch` (diagonal lines) across every textured surface at once - disabled controls and decorative fills alike. `TextureSelect` is a ready-made picker.
- **Right-to-left:** all component styles use CSS logical properties, so setting `dir="rtl"` on any ancestor mirrors the layout correctly.
- **Reduced motion:** under `prefers-reduced-motion: reduce`, animations/transitions collapse to a static two-color equivalent (spinner stops rotating, indeterminate progress becomes a static dither, skeleton keeps its dither without pulsing).
- **Forms:** value controls expose a `name` prop that mirrors their value to hidden input(s) for native form submission and libraries like react-hook-form; `useControllableState` accepts an updater function like `useState`.

## Conventions

- **Styling:** plain SCSS (no CSS modules). Class names use `snake_case` with single underscores only, namespaced with a `du_` prefix (e.g. `du_button`, `du_button_icon`, `du_button_primary`). This is enforced by Stylelint.
- **Color:** only `--fg` / `--bg`. State is never conveyed by color alone.
- **Accessibility:** every palette must meet WCAG AAA (7:1) contrast between the two colors.

## Releasing (manual)

```bash
pnpm build
npm version <patch|minor|major>
npm publish
```
