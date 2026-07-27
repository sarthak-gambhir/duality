# Divider

A one-pixel-family rule drawn in the foreground color.

Polymorphic: also accepts an `as` prop to change the rendered element, plus that element's native props.

## Props

| Prop          | Type                         | Default | Description                                                         |
| ------------- | ---------------------------- | ------- | ------------------------------------------------------------------- |
| `className`   | `string`                     | -       |                                                                     |
| `decorative`  | `boolean`                    | -       | Purely visual rule: drop the `separator` role. Defaults to false.   |
| `label`       | `ReactNode`                  | -       | Optional centered label with a rule on each side (horizontal only). |
| `orientation` | `"horizontal" \| "vertical"` | -       | Line direction. Defaults to horizontal.                             |
