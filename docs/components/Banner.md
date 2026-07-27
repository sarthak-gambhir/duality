# Banner

Full-width, page-level callout. Optionally dismissible with an action slot.

## Props

| Prop           | Type                             | Default   | Description                                                         |
| -------------- | -------------------------------- | --------- | ------------------------------------------------------------------- |
| `action`       | `ReactNode`                      | -         | Action slot (e.g. a Button) shown at the trailing edge.             |
| `children`     | `ReactNode`                      | -         | Banner message.                                                     |
| `className`    | `string`                         | -         |                                                                     |
| `dismissLabel` | `string`                         | `Dismiss` | Accessible label for the close button.                              |
| `onDismiss`    | `(() => void)`                   | -         | Show a close button and call this when pressed.                     |
| `title`        | `ReactNode`                      | -         | Optional bold heading.                                              |
| `tone`         | `"info" \| "warning" \| "error"` | `info`    | Severity. Signalled by marker shape + border style, never by color. |
