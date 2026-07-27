# Rating

Pixel-block rating. Fill (never color) conveys the value: filled blocks are `--fg`, empty blocks are outlined, half blocks are split. Hover/focus previews.

## Props

| Prop            | Type                        | Default | Description                                                          |
| --------------- | --------------------------- | ------- | -------------------------------------------------------------------- |
| `allowClear`    | `boolean`                   | -       | Clicking the current value (or Home) resets to 0.                    |
| `allowHalf`     | `boolean`                   | -       | Allow half-block (0.5) increments.                                   |
| `defaultValue`  | `number`                    | -       | Initial rating (uncontrolled).                                       |
| `disabled`      | `boolean`                   | -       | Disables interaction and dithers the control.                        |
| `label`         | `ReactNode`                 | -       | Accessible group label.                                              |
| `max`           | `number`                    | `5`     | Number of blocks.                                                    |
| `name`          | `string`                    | -       | Name of a hidden input so the value participates in form submission. |
| `onValueChange` | `((value: number) => void)` | -       | Called with the new rating.                                          |
| `readOnly`      | `boolean`                   | -       | Renders as a non-interactive display.                                |
| `size`          | `"sm" \| "md" \| "lg"`      | `md`    | Control size.                                                        |
| `value`         | `number`                    | -       | Current rating 0..max (controlled).                                  |
