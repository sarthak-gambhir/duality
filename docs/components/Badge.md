# Badge

Small inline chip / tag.

## Props

| Prop          | Type                   | Default  | Description                                                            |
| ------------- | ---------------------- | -------- | ---------------------------------------------------------------------- |
| `count`       | `number`               | -        | Render a numeric count, overflowing to `max+`. Takes over the content. |
| `dot`         | `boolean`              | -        | Show a leading status dot (a two-color square).                        |
| `max`         | `number`               | `99`     | Overflow threshold for `count`. Defaults to `99`.                      |
| `onRemove`    | `(() => void)`         | -        | Show a remove control (chip/tag use) and call this when pressed.       |
| `removeLabel` | `string`               | `Remove` | Accessible label for the remove control.                               |
| `showZero`    | `boolean`              | -        | Render the badge even when `count` is `0`.                             |
| `size`        | `"sm" \| "md" \| "lg"` | `sm`     | Control size.                                                          |
| `variant`     | `"solid" \| "outline"` | `solid`  | `solid` is filled, `outline` is bordered only.                         |
