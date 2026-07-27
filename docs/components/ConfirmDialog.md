# ConfirmDialog

Confirmation dialog built on Modal. Focuses the confirm action on open (Cancel for destructive actions) and shows a pending state for async confirms.

## Props

| Prop                   | Type                          | Default   | Description                                                              |
| ---------------------- | ----------------------------- | --------- | ------------------------------------------------------------------------ |
| `cancelLabel`          | `string`                      | `Cancel`  | Cancel button label. Defaults to "Cancel".                               |
| `className`            | `string`                      | -         |                                                                          |
| `closeOnBackdrop`      | `boolean`                     | `true`    | Close on backdrop press. Defaults to true.                               |
| `closeOnEscape`        | `boolean`                     | `true`    | Close on Escape. Defaults to true.                                       |
| `confirmLabel`         | `string`                      | `Confirm` | Confirm button label. Defaults to "Confirm".                             |
| `description`          | `ReactNode`                   | -         | Explanatory body text.                                                   |
| `isLoading`            | `boolean`                     | `false`   | Force the pending state (e.g. when confirmation is driven externally).   |
| `isOpen` (required)    | `boolean`                     | -         | Whether the dialog is open.                                              |
| `onCancel` (required)  | `() => void`                  | -         | Called when the user cancels (button, backdrop, or Escape).              |
| `onConfirm` (required) | `() => void \| Promise<void>` | -         | Called when the user confirms. May be async; buttons show pending state. |
| `title` (required)     | `ReactNode`                   | -         | Dialog heading.                                                          |
| `tone`                 | `"default" \| "danger"`       | `default` | `danger` signals a destructive action via a heavier confirm border.      |
