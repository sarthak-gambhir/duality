# Textarea

Multi-line text field sharing the Input styling.

## Props

| Prop             | Type                   | Default | Description                                                          |
| ---------------- | ---------------------- | ------- | -------------------------------------------------------------------- |
| `autosize`       | `boolean`              | -       | Grow the field to fit its content.                                   |
| `disabledReason` | `ReactNode`            | -       | When disabled, reason shown in a persistent caption below the field. |
| `invalid`        | `boolean`              | -       | Marks the field invalid (border-style change + `aria-invalid`).      |
| `maxRows`        | `number`               | -       | Maximum rows before the field scrolls (only with `autosize`).        |
| `minRows`        | `number`               | -       | Minimum visible rows (also the starting height).                     |
| `showCount`      | `boolean`              | -       | Show a character counter (uses `maxLength` when set).                |
| `size`           | `"sm" \| "md" \| "lg"` | `md`    | Control size.                                                        |
