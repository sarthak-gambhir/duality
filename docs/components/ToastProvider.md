# ToastProvider

Provides `useToast()` and renders the toast stack in a portal.

## Props

| Prop        | Type                                                                                            | Default         | Description                                                                 |
| ----------- | ----------------------------------------------------------------------------------------------- | --------------- | --------------------------------------------------------------------------- |
| `label`     | `string`                                                                                        | `Notifications` | Accessible name for the toast region. Defaults to "Notifications".          |
| `max`       | `number`                                                                                        | -               | Maximum simultaneously visible toasts; extras queue. Defaults to unlimited. |
| `placement` | `"top-start" \| "bottom-start" \| "top-end" \| "bottom-end" \| "top-center" \| "bottom-center"` | `bottom-end`    | Where the stack appears. Defaults to bottom-end.                            |
