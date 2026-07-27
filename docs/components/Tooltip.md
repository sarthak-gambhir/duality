# Tooltip

Text hint shown on hover/focus. Portaled and positioned with collision-aware flipping; a close delay keeps it visible while the pointer bridges the gap.

## Props

| Prop                  | Type                                                      | Default | Description                                                 |
| --------------------- | --------------------------------------------------------- | ------- | ----------------------------------------------------------- |
| `arrow`               | `boolean`                                                 | `false` | Show a pointer arrow toward the trigger. Defaults to false. |
| `children` (required) | `ReactElement<any, string \| JSXElementConstructor<any>>` | -       | Single focusable trigger element.                           |
| `className`           | `string`                                                  | -       | Class applied to the tooltip bubble.                        |
| `closeDelay`          | `number`                                                  | `0`     | Delay before hiding, in ms. Defaults to 0.                  |
| `content` (required)  | `ReactNode`                                               | -       | Tooltip contents.                                           |
| `defaultOpen`         | `boolean`                                                 | `false` | Initial open state (uncontrolled).                          |
| `offset`              | `number`                                                  | -       | Gap between trigger and tooltip, in px. Defaults to 8.      |
| `onOpenChange`        | `((open: boolean) => void)`                               | -       | Called when open state changes.                             |
| `open`                | `boolean`                                                 | -       | Controlled open state.                                      |
| `openDelay`           | `number`                                                  | `150`   | Delay before showing, in ms. Defaults to 150.               |
| `placement`           | `"top" \| "bottom" \| "left" \| "right"`                  | `top`   | Side of the trigger to render on. Defaults to top.          |
| `rootClassName`       | `string`                                                  | -       | Class applied to the wrapper that anchors the trigger.      |
