# Icon

Two-color icon wrapper around react-icons. Icons render with `fill: currentColor`, so they inherit `--fg`/`--bg` through `color` and invert with their surface. Decorative by default; pass `label` to name it.

## Props

| Prop              | Type               | Default | Description                                                                                                                                                                                                          |
| ----------------- | ------------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `className`       | `string`           | -       |                                                                                                                                                                                                                      |
| `icon` (required) | `IconType`         | -       | The react-icons component to render (use a Remix `ri` line icon).                                                                                                                                                    |
| `label`           | `string`           | -       | Accessible label. When set the icon is exposed as `role="img"`; otherwise it is decorative and hidden from assistive tech.                                                                                           |
| `size`            | `string \| number` | `1em`   | Icon size. A tier keyword (`"sm" \| "md" \| "lg" \| "xl"`) maps to the `--icon-*` tokens; a number is px and any other string passes through. Defaults to `"1em"` so the icon scales with the surrounding font size. |
| `style`           | `CSSProperties`    | -       |                                                                                                                                                                                                                      |
