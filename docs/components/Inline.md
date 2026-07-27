# Inline

Horizontal flex layout with token-based spacing and optional wrapping. Renders a `div` by default; use `as` for semantic elements (`nav`, `ul`, ...).

Polymorphic: also accepts an `as` prop to change the rendered element, plus that element's native props.

## Props

| Prop        | Type                                                                | Default | Description                                         |
| ----------- | ------------------------------------------------------------------- | ------- | --------------------------------------------------- |
| `align`     | `"center" \| "end" \| "start" \| "stretch" \| "baseline"`           | -       | Cross-axis alignment.                               |
| `className` | `string`                                                            | -       |                                                     |
| `gap`       | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8`                         | -       | Space between children, as a `--space-*` step.      |
| `justify`   | `"center" \| "end" \| "start" \| "between" \| "around" \| "evenly"` | -       | Main-axis distribution.                             |
| `wrap`      | `boolean`                                                           | -       | Allow wrapping to multiple lines. Defaults to true. |
