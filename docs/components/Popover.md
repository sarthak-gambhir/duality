# Popover

Click-triggered anchored panel, dismissed on outside press or Escape. Rendered in a portal and positioned with collision-aware flip/shift.

## Props

| Prop                  | Type                                                                                                                                                                 | Default        | Description                                                   |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------------------------------------------------------------- |
| `arrow`               | `boolean`                                                                                                                                                            | `false`        | Show a pointer arrow toward the trigger. Defaults to false.   |
| `children` (required) | `ReactNode`                                                                                                                                                          | -              | Panel contents.                                               |
| `className`           | `string`                                                                                                                                                             | -              |                                                               |
| `defaultOpen`         | `boolean`                                                                                                                                                            | `false`        | Initial open state (uncontrolled).                            |
| `flip`                | `boolean`                                                                                                                                                            | -              | Flip to the opposite side on overflow. Defaults to true.      |
| `offset`              | `number`                                                                                                                                                             | -              | Gap between trigger and panel, in px. Defaults to 8.          |
| `onOpenChange`        | `((open: boolean) => void)`                                                                                                                                          | -              | Called when open state changes.                               |
| `open`                | `boolean`                                                                                                                                                            | -              | Controlled open state.                                        |
| `placement`           | `"top" \| "bottom" \| "left" \| "right" \| "top-start" \| "bottom-start" \| "left-start" \| "right-start" \| "top-end" \| "bottom-end" \| "left-end" \| "right-end"` | `bottom-start` | Anchor position. Defaults to bottom-start.                    |
| `shift`               | `boolean`                                                                                                                                                            | -              | Slide along the cross axis to stay in view. Defaults to true. |
| `trigger` (required)  | `ReactElement<TriggerProps, string \| JSXElementConstructor<any>>`                                                                                                   | -              | Clickable trigger element.                                    |
