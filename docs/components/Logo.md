# Logo

The Duality brand mark: a two-tone circular glyph whose disk and inner cut map to `--fg` / `--bg`, so it inverts with the active theme and reads on any surface. Decorative by default; pass `label` to name it.

## Props

| Prop        | Type               | Default | Description                                                                                                                 |
| ----------- | ------------------ | ------- | --------------------------------------------------------------------------------------------------------------------------- |
| `className` | `string`           | -       |                                                                                                                             |
| `label`     | `string`           | -       | Accessible label. When set the mark is exposed as `role="img"`; otherwise it is decorative and hidden from assistive tech.  |
| `size`      | `string \| number` | `1em`   | Mark size. A number is px; a string passes through (defaults to `"1em"` so the mark scales with the surrounding font size). |
| `style`     | `CSSProperties`    | -       |                                                                                                                             |
