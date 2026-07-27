# Progress

Two-color progress bar.

## Props

| Prop            | Type                                       | Default                                         | Description                                                     |
| --------------- | ------------------------------------------ | ----------------------------------------------- | --------------------------------------------------------------- |
| `formatValue`   | `((value: number, max: number) => string)` | `` (v, m) => `${Math.round((v / m) * 100)}%` `` | Formats the value label. Defaults to a rounded percentage.      |
| `indeterminate` | `boolean`                                  | `false`                                         | Unknown-progress mode with an animated dither fill.             |
| `max`           | `number`                                   | `100`                                           | Maximum value. Defaults to 100.                                 |
| `showValue`     | `boolean`                                  | `false`                                         | Show a value label beside the bar (ignored when indeterminate). |
| `size`          | `"sm" \| "md" \| "lg"`                     | `sm`                                            | Control height.                                                 |
| `value`         | `number`                                   | `0`                                             | Current value (ignored when indeterminate).                     |
