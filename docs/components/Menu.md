# Menu

Dropdown menu with a button trigger and a keyboard-navigable listbox.

## Props

| Prop                  | Type                                                                                                                                                                 | Default        | Description                                              |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | -------------------------------------------------------- |
| `aria-label`          | `string`                                                                                                                                                             | -              | Accessible name for the menu.                            |
| `children` (required) | `ReactNode`                                                                                                                                                          | -              | MenuItem / MenuSeparator children.                       |
| `className`           | `string`                                                                                                                                                             | -              |                                                          |
| `defaultOpen`         | `boolean`                                                                                                                                                            | `false`        | Initial open state (uncontrolled).                       |
| `flip`                | `boolean`                                                                                                                                                            | -              | Flip to the opposite side on overflow. Defaults to true. |
| `offset`              | `number`                                                                                                                                                             | -              | Gap between trigger and menu, in px. Defaults to 8.      |
| `onOpenChange`        | `((open: boolean) => void)`                                                                                                                                          | -              | Called when open state changes.                          |
| `open`                | `boolean`                                                                                                                                                            | -              | Controlled open state.                                   |
| `placement`           | `"top" \| "bottom" \| "left" \| "right" \| "top-start" \| "bottom-start" \| "left-start" \| "right-start" \| "top-end" \| "bottom-end" \| "left-end" \| "right-end"` | `bottom-start` | Anchor position. Defaults to bottom-start.               |
| `trigger` (required)  | `ReactElement<TriggerProps, string \| JSXElementConstructor<any>>`                                                                                                   | -              | Clickable trigger element.                               |
