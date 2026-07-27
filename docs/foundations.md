# Foundations reference (tokens, mixins, icons)

Authoring reference for building or extending Duality components. Everything here
is sourced from [src/tokens/tokens.scss](../src/tokens/tokens.scss),
[src/styles/mixins.scss](../src/styles/mixins.scss), and
[src/components/icon/icons.ts](../src/components/icon/icons.ts). Prefer these
tokens/mixins over raw values - it keeps the two-color model, density, RTL, and
the texture toggle working automatically.

## Color

Only two runtime colors exist: `--fg` and `--bg`. They are set per theme on the
`du_theme_root` scope (`data-theme`). Never introduce a third color, hue, gray,
shadow, or transparency. Swap the pair locally for hover/selected via `du_invert`.

Built-in themes: `classic` (default), `dark`, `paper`, `slate`, `sepia`,
`amber`, `phosphor`, `blueprint`, `teal`, `sakura`. Every pair meets WCAG AAA
(7:1) and is verified by `test/contrast.test.ts`.

## Spacing scale (`--space-0` ... `--space-8`)

Density-aware: the `compact` column applies under `data-density="compact"`.

| Token | Comfortable | Compact |
| --- | --- | --- |
| `--space-0` | 0 | 0 |
| `--space-1` | 4px | 2px |
| `--space-2` | 8px | 6px |
| `--space-3` | 12px | 8px |
| `--space-4` | 16px | 12px |
| `--space-5` | 24px | 16px |
| `--space-6` | 32px | 24px |
| `--space-7` | 48px | 32px |
| `--space-8` | 64px | 48px |

## Sizing scale (control heights)

Also density-aware.

| Token | Comfortable | Compact |
| --- | --- | --- |
| `--size-sm` | 20px | 16px |
| `--size-md` | 24px | 20px |
| `--size-lg` | 32px | 28px |
| `--size-xl` | 40px | 36px |

## Icon sizes (density-independent)

Intentionally not shrunk under compact density, so thin line icons stay legible.

| Token | Value |
| --- | --- |
| `--icon-sm` | 16px |
| `--icon-md` | 20px |
| `--icon-lg` | 24px |
| `--icon-xl` | 32px |

## Typography

- Families: `--font-sans`, `--font-mono`.
- Stepped size scale: `--font-size-1` (14px), `--font-size-2` (16px, body base
  via `--font-size`), `--font-size-3` (18px), `--font-size-4` (20px),
  `--font-size-5` (24px), `--font-size-6` (32px), `--font-size-7` (40px).
- Line heights: `--line-height` (1.5), `--line-height-heading` (1.2).
- Weights: only `--font-weight-normal` (400) and `--font-weight-bold` (700).

## Borders and radius

- `--border-width`: 2px (standard pixel edge).
- `--border-width-thick`: 4px.
- `--radius`: 0 - edges are never rounded.

## Texture and disabled tokens

The texture fill is a single pair of variables switched globally by
`data-texture` on the theme root, so `dither` (default) and `hatch` flip every
textured surface at once.

| Token | Purpose |
| --- | --- |
| `--texture-image` | The fill pattern (`dither` checkerboard or `hatch` diagonal lines). |
| `--texture-size` | Background size for the pattern (`4px 4px` for dither, `auto` for hatch). |
| `--disabled-stroke` | Width of the `--bg` text-stroke plate that keeps disabled value text legible (6px). |
| `--disabled-text-inset` | Inline inset reserving room for the outward stroke plate so the first/last glyph is not clipped (`calc(var(--disabled-stroke) / 2 + 1px)`). |

## Layering (z-index)

`--z-popover` (900) < `--z-modal` (1000) < `--z-toast` (1100). Use these for any
new overlay so stacking stays consistent.

## Container widths

`--container-sm` (640px), `--container-md` (768px), `--container-lg` (960px),
`--container-xl` (1200px).

## Mixin catalog

Import with `@use "../../styles/mixins" as m;` then `@include m.<name>;`.

| Mixin | Signature | Use |
| --- | --- | --- |
| `du_border` | `($width: var(--border-width))` | Pixel border in `--fg`, radius 0. |
| `du_focus` | - | Color-safe outset `:focus-visible` ring, offset 2px. |
| `du_focus_inset` | `($color: var(--fg))` | Inset focus ring for edge-filling controls (tabs, accordion); pass `var(--bg)` on `--fg`-filled surfaces. |
| `du_invert` | - | Swap the pair (`color: --bg; background: --fg`) for hover/selected/pressed. |
| `du_reset_control` | - | Strip native control chrome (margin/font/background/border/appearance). |
| `du_link_text` | - | Text-link look: underline + invert on hover + focus ring. Use on `Link` and link-like buttons. |
| `du_texture_fill` | - | Neutral texture "gray" for decorative fills (skeletons, scrims, tracks) and disabled selection controls. Follows `data-texture`. |
| `du_disabled_field` | `($label: true)` | Disabled value control: texture fill plus a `--bg` text-stroke plate behind the value so it stays legible. Pass `$label: false` for chip-value controls (MultiSelect, TagInput). |
| `du_text_outline` | `($radius: 2, $color: var(--bg))` | Rings each glyph with a solid two-color outline so labels stay legible over a texture (used on disabled selection controls). |
| `du_dither_icon_stroke` | - | `--bg` stroke + `paint-order: stroke` so an SVG icon stays legible over a texture fill. |

### Disabled recipe

```scss
// selection / action control (Button, Checkbox, ToggleGroup, ...)
&:disabled {
  @include m.du_texture_fill;
  @include m.du_text_outline(2);
}

// value-entry control (Input, Select, DatePicker, ...)
&:disabled {
  @include m.du_disabled_field; // fill + --bg stroke plate behind the value
}
```

## Icon registry slots

Render via `<Icon icon={icons.<slot>} />` where `icons = useIcons()`. Consumers
override any slot with `IconsProvider`. Defaults are Remix (`ri`) line icons
(with `dot` and `starFilled` as the two intentional fill exceptions).

`close`, `check`, `dash`, `add`, `radioOn`, `chevronDown`, `chevronUp`,
`chevronLeft`, `chevronRight`, `firstPage`, `lastPage`, `sortNone`, `sortAsc`,
`sortDesc`, `star`, `starHalf`, `starFilled`, `lock`, `calendar`, `clock`,
`search`, `more`, `spinner`, `deltaUp`, `deltaDown`, `deltaNeutral`, `toneInfo`,
`toneSuccess`, `toneWarning`, `toneError`, `stepComplete`, `markerComplete`,
`markerCurrent`, `markerBlank`, `dot`, `empty`, `avatarFallback`, `upload`,
`externalLink`.
