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

All components are drawn with the two-color model: base is `--fg` on `--bg`, hover/selected inverts the pair, focus adds an outline, and disabled uses a dither fill. State is never conveyed by color alone.

- **Layout:** `Box` (polymorphic), `Stack`, `Inline`, `Grid`, `Container`, `Divider`
- **Typography:** `Text` (polymorphic), `Heading`, `Link`, `Code`, `Kbd`
- **Form controls:** `Button`, `Input`, `Textarea`, `Checkbox`, `Radio` + `RadioGroup`, `Switch`, `Select`, `NumberInput`, `ToggleGroup` (+ `ToggleGroupItem`), `Rating`, `Combobox`, `Slider`, `RangeSlider`, `DatePicker`, `TimePicker`, `TagInput`
- **Form composition:** `Label`, `FormField` (wires `id` / `aria-describedby` / `aria-invalid`)
- **Display:** `Card` (+ `CardHeader` / `CardBody` / `CardFooter`), `Badge` (alias `Tag`), `Alert`, `Avatar`, `Progress`, `Spinner`, `Skeleton`
- **Data:** `Table` (+ `THead` / `TBody` / `Tr` / `Th` / `Td`), `DataTable` (sortable + filterable), `Tree`
- **Navigation:** `Breadcrumbs`, `Pagination`, `Stepper`
- **Disclosure:** `Tabs` (+ `TabList` / `Tab` / `TabPanel`), `Accordion` (+ `AccordionItem`)
- **Overlays:** `Modal` (+ sections), `Drawer` (+ sections), `Tooltip`, `Popover`, `Menu` (+ `MenuItem` / `MenuSeparator`), `CommandPalette`, `Toast` (`ToastProvider` / `useToast`)
- **Theming:** `ThemeToggle`, `PaletteSelect`, and hooks/utilities `useDisclosure`, `Portal`, `useControllableState`

Theme utilities (`ThemeProvider`, `useTheme`, `palettes`, `contrastRatio`, `meetsAAA`) and the `cx` classname helper are also exported. `ThemeProvider` supports optional `storageKey` persistence and `defaultInverted="system"` to follow the OS color scheme. Each component has a Storybook story; interactive components have Vitest + Testing Library coverage.

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
