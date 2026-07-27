# Container

Centered, max-width page wrapper with horizontal padding. Renders a `div` by default; use `as="main"` for the primary landmark.

Polymorphic: also accepts an `as` prop to change the rendered element, plus that element's native props.

## Props

| Prop        | Type                                        | Default | Description                                                           |
| ----------- | ------------------------------------------- | ------- | --------------------------------------------------------------------- |
| `className` | `string`                                    | -       |                                                                       |
| `maxWidth`  | `number`                                    | -       | Custom max content width in pixels. Overrides `size` when set.        |
| `padding`   | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8` | -       | Horizontal padding, as a `--space-*` step. Defaults to 4.             |
| `size`      | `"sm" \| "md" \| "lg" \| "xl"`              | -       | Max-width preset mapped to a `--container-*` token. Defaults to `lg`. |
