# Grid

CSS grid with token-based gaps. Fixed equal `columns` by default, or a responsive auto-fit track when `minChildWidth` is set.

Polymorphic: also accepts an `as` prop to change the rendered element, plus that element's native props.

## Props

| Prop            | Type                                        | Default | Description                                                                                                             |
| --------------- | ------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------- |
| `align`         | `"center" \| "end" \| "start" \| "stretch"` | -       | Block-axis alignment of cells within their tracks.                                                                      |
| `className`     | `string`                                    | -       |                                                                                                                         |
| `columns`       | `number`                                    | -       | Number of equal-width columns. Ignored when `minChildWidth` is set.                                                     |
| `gap`           | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8` | -       | Space between cells, as a `--space-*` step.                                                                             |
| `justify`       | `"center" \| "end" \| "start" \| "stretch"` | -       | Inline-axis alignment of cells within their tracks.                                                                     |
| `minChildWidth` | `number`                                    | -       | Responsive auto-fit: pack as many columns as fit, each at least this many pixels wide. Takes precedence over `columns`. |
