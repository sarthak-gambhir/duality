# Drawer

Accessible edge-anchored panel (Sheet) rendered in a portal over a dithered scrim.

## Props

| Prop                 | Type                                    | Default | Description                                                              |
| -------------------- | --------------------------------------- | ------- | ------------------------------------------------------------------------ |
| `aria-describedby`   | `string`                                | -       | Id of the element describing the dialog.                                 |
| `aria-label`         | `string`                                | -       | Accessible name (use when there is no visible titled header).            |
| `aria-labelledby`    | `string`                                | -       | Id of the element labelling the dialog (e.g. a DrawerHeader).            |
| `className`          | `string`                                | -       |                                                                          |
| `closeOnBackdrop`    | `boolean`                               | `true`  | Close when the backdrop is pressed. Defaults to true.                    |
| `closeOnEscape`      | `boolean`                               | `true`  | Close on Escape. Defaults to true.                                       |
| `finalFocusRef`      | `RefObject<HTMLElement \| null>`        | -       | Element to focus when the drawer closes (defaults to the prior element). |
| `initialFocusRef`    | `RefObject<HTMLElement \| null>`        | -       | Element to focus when the drawer opens (defaults to first focusable).    |
| `isDismissable`      | `boolean`                               | -       | Convenience: when false, disables both backdrop and Escape dismissal.    |
| `isOpen` (required)  | `boolean`                               | -       | Whether the drawer is open.                                              |
| `lockScroll`         | `boolean`                               | `true`  | Lock body scroll while open. Defaults to true.                           |
| `onClose` (required) | `() => void`                            | -       | Called when the drawer requests to close (backdrop press or Escape).     |
| `showCloseButton`    | `boolean`                               | `false` | Render a close (X) button in the header corner. Defaults to false.       |
| `side`               | `"end" \| "start" \| "top" \| "bottom"` | `end`   | Edge the panel is anchored to. Defaults to `end`.                        |
| `size`               | `string \| number`                      | `md`    | Panel size: a preset (`sm`/`md`/`lg`/`full`), px number, or CSS length.  |
