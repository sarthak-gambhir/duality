# Modal

Accessible modal dialog rendered in a portal with a dithered backdrop.

## Props

| Prop                 | Type                                     | Default  | Description                                                                  |
| -------------------- | ---------------------------------------- | -------- | ---------------------------------------------------------------------------- |
| `aria-describedby`   | `string`                                 | -        | Id of the element describing the dialog.                                     |
| `aria-label`         | `string`                                 | -        | Accessible name (use when there is no visible titled header).                |
| `aria-labelledby`    | `string`                                 | -        | Id of the element labelling the dialog (e.g. a ModalHeader).                 |
| `className`          | `string`                                 | -        |                                                                              |
| `closeOnBackdrop`    | `boolean`                                | `true`   | Close when the backdrop is pressed. Defaults to true.                        |
| `closeOnEscape`      | `boolean`                                | `true`   | Close on Escape. Defaults to true.                                           |
| `finalFocusRef`      | `RefObject<HTMLElement \| null>`         | -        | Element to focus when the modal closes (defaults to the prior element).      |
| `initialFocusRef`    | `RefObject<HTMLElement \| null>`         | -        | Element to focus when the modal opens (defaults to first focusable).         |
| `isDismissable`      | `boolean`                                | -        | Convenience: when false, disables both backdrop and Escape dismissal.        |
| `isOpen` (required)  | `boolean`                                | -        | Whether the modal is open.                                                   |
| `lockScroll`         | `boolean`                                | `true`   | Lock body scroll while open. Defaults to true.                               |
| `maxWidth`           | `number`                                 | -        | Max width of the dialog in pixels. Overrides `size`.                         |
| `onClose` (required) | `() => void`                             | -        | Called when the modal requests to close (backdrop press or Escape).          |
| `role`               | `"dialog" \| "alertdialog"`              | `dialog` | Dialog role. Use `alertdialog` for urgent confirmations. Defaults to dialog. |
| `showCloseButton`    | `boolean`                                | `false`  | Render a close (X) button in the top corner. Defaults to false.              |
| `size`               | `"sm" \| "md" \| "lg" \| "xl" \| "full"` | `md`     | Width preset. Defaults to md. Ignored when `maxWidth` is set.                |
