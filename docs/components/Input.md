# Input

Single-line text field. Invalid state shows a dashed border, not color.

## Props

| Prop             | Type                   | Default | Description                                                          |
| ---------------- | ---------------------- | ------- | -------------------------------------------------------------------- |
| `clearable`      | `boolean`              | -       | Show a clear button that empties the field when it has a value.      |
| `disabledReason` | `ReactNode`            | -       | When disabled, reason shown in a persistent caption below the field. |
| `invalid`        | `boolean`              | -       | Marks the field invalid (border-style change + `aria-invalid`).      |
| `onClear`        | `(() => void)`         | -       | Called after the field is cleared.                                   |
| `prefix`         | `ReactNode`            | -       | Content rendered before the field (icon, unit, etc.).                |
| `size`           | `"sm" \| "md" \| "lg"` | `md`    | Control size.                                                        |
| `suffix`         | `ReactNode`            | -       | Content rendered after the field.                                    |
