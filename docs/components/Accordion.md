# Accordion

Vertically stacked, collapsible disclosure sections.

## Props

| Prop            | Type                                    | Default  | Description                                                                                                                      |
| --------------- | --------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `collapsible`   | `boolean`                               | `true`   | In single mode, whether the open item can be collapsed by re-clicking it. When false, one item is always open. Defaults to true. |
| `defaultValue`  | `string \| string[]`                    | -        | Initially open item value(s) (uncontrolled).                                                                                     |
| `headingLevel`  | `1 \| 2 \| 3 \| 4 \| 5 \| 6`            | `3`      | Heading element level wrapping each trigger, 1-6. Defaults to 3.                                                                 |
| `onValueChange` | `((value: string \| string[]) => void)` | -        | Called with the open value(s): a string in single mode, array in multiple.                                                       |
| `type`          | `"single" \| "multiple"`                | `single` | `single` allows one open item; `multiple` allows many. Defaults to single.                                                       |
| `value`         | `string \| string[]`                    | -        | Open item value(s) (controlled).                                                                                                 |
