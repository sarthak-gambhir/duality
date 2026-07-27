# Stat

Compact metric display: label, value, and an optional directional delta.

## Props

| Prop               | Type                          | Default | Description                                                  |
| ------------------ | ----------------------------- | ------- | ------------------------------------------------------------ |
| `delta`            | `ReactNode`                   | -       | Optional change indicator shown below the value.             |
| `deltaDirection`   | `"up" \| "down" \| "neutral"` | -       | Direction of the delta; shown as an arrow shape (not color). |
| `icon`             | `ReactNode`                   | -       | Optional icon shown beside the label.                        |
| `label` (required) | `ReactNode`                   | -       | Descriptive label above the value.                           |
| `value` (required) | `ReactNode`                   | -       | The primary metric.                                          |
