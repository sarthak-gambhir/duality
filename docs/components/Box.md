# Box

Polymorphic base element. Renders a `div` by default; use `as` to change it.

Polymorphic: also accepts an `as` prop to change the rendered element, plus that element's native props.

## Props

| Prop        | Type                                        | Default | Description                                                          |
| ----------- | ------------------------------------------- | ------- | -------------------------------------------------------------------- |
| `border`    | `boolean`                                   | -       | Draw a one-pixel foreground border.                                  |
| `className` | `string`                                    | -       |                                                                      |
| `padding`   | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8` | -       | Padding on all sides, as a `--space-*` step.                         |
| `paddingX`  | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8` | -       | Horizontal (inline) padding. Overrides `padding` on the inline axis. |
| `paddingY`  | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8` | -       | Vertical (block) padding. Overrides `padding` on the block axis.     |
| `radius`    | `boolean`                                   | -       | Apply the token radius (currently square in the two-color model).    |
