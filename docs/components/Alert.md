# Alert

Callout box. Tone is conveyed by a pixel marker and border style.

## Props

| Prop           | Type                                          | Default   | Description                                                         |
| -------------- | --------------------------------------------- | --------- | ------------------------------------------------------------------- |
| `action`       | `ReactNode`                                   | -         | Action slot (e.g. a Button/Link) shown at the trailing edge.        |
| `dismissLabel` | `string`                                      | `Dismiss` | Accessible label for the close button.                              |
| `icon`         | `ReactNode`                                   | -         | Replaces the default tone marker (e.g. a custom pixel icon).        |
| `onDismiss`    | `(() => void)`                                | -         | Show a close button and call this when pressed.                     |
| `title`        | `ReactNode`                                   | -         | Optional bold heading above the body.                               |
| `tone`         | `"info" \| "success" \| "warning" \| "error"` | `info`    | Severity. Signalled by marker shape + border style, never by color. |
