# Text

Polymorphic inline/block text with token-based sizing.

Polymorphic: also accepts an `as` prop to change the rendered element, plus that element's native props.

## Props

| Prop        | Type                           | Default | Description                                                        |
| ----------- | ------------------------------ | ------- | ------------------------------------------------------------------ |
| `align`     | `"center" \| "end" \| "start"` | -       | Text alignment.                                                    |
| `className` | `string`                       | -       |                                                                    |
| `lineClamp` | `number`                       | -       | Clamp to N lines with an ellipsis. Ignored when `truncate` is set. |
| `mono`      | `boolean`                      | -       | Use the monospace font family.                                     |
| `size`      | `"sm" \| "md" \| "lg" \| "xl"` | -       | Font size step.                                                    |
| `truncate`  | `boolean`                      | -       | Truncate to a single line with an ellipsis.                        |
| `weight`    | `"normal" \| "bold"`           | -       | Font weight (the two-color model only uses normal/bold).           |
