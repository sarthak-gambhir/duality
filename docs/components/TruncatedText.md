# TruncatedText

Text that truncates (single line) or clamps (multi line) and reveals the full value in a tooltip only when it is actually overflowing. The complete text always stays in the DOM, so assistive tech reads it regardless.

## Props

| Prop               | Type                                     | Default | Description                                                                                             |
| ------------------ | ---------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------- |
| `align`            | `"center" \| "end" \| "start"`           | -       | Text alignment.                                                                                         |
| `className`        | `string`                                 | -       |                                                                                                         |
| `lines`            | `number`                                 | `1`     | Lines to show before clipping. `1` (default) is a single-line ellipsis; `>1` clamps to that many lines. |
| `mono`             | `boolean`                                | -       | Use the monospace font family.                                                                          |
| `size`             | `"sm" \| "md" \| "lg" \| "xl"`           | -       | Font size step.                                                                                         |
| `tooltip`          | `ReactNode`                              | -       | Tooltip contents shown when clipped. Defaults to `children`.                                            |
| `tooltipPlacement` | `"top" \| "bottom" \| "left" \| "right"` | `top`   | Side the tooltip renders on. Defaults to `top`.                                                         |
| `weight`           | `"normal" \| "bold"`                     | -       | Font weight (the two-color model only uses normal/bold).                                                |
