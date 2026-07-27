# PinInput

Segmented one-time-code entry with auto-advance, Backspace, and paste.

## Props

| Prop                | Type                                                     | Default             | Description                                                               |
| ------------------- | -------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------- |
| `aria-describedby`  | `string`                                                 | -                   |                                                                           |
| `aria-errormessage` | `string`                                                 | -                   |                                                                           |
| `aria-invalid`      | `boolean`                                                | -                   |                                                                           |
| `aria-label`        | `string`                                                 | `Verification code` | Base accessible name; each cell is labelled "<label>, digit N of M".      |
| `aria-labelledby`   | `string`                                                 | -                   |                                                                           |
| `aria-required`     | `boolean`                                                | -                   |                                                                           |
| `className`         | `string`                                                 | -                   |                                                                           |
| `defaultValue`      | `string`                                                 | -                   | Initial value (uncontrolled).                                             |
| `disabled`          | `boolean`                                                | -                   |                                                                           |
| `disabledReason`    | `ReactNode`                                              | -                   | When disabled, reason shown in a persistent caption below the field.      |
| `id`                | `string`                                                 | -                   |                                                                           |
| `length`            | `number`                                                 | `4`                 | Number of cells. Defaults to 4.                                           |
| `mask`              | `boolean`                                                | -                   | Obscure entered characters.                                               |
| `name`              | `string`                                                 | -                   | When set, the assembled value is mirrored to a hidden input of this name. |
| `onBlur`            | `((event: FocusEvent<HTMLDivElement, Element>) => void)` | -                   | Called when focus leaves the group (for form-library integration).        |
| `onComplete`        | `((value: string) => void)`                              | -                   | Called once every cell is filled.                                         |
| `onValueChange`     | `((value: string) => void)`                              | -                   | Called with the assembled string on every change.                         |
| `type`              | `"numeric" \| "alphanumeric"`                            | `numeric`           | Allowed characters. Defaults to `numeric`.                                |
| `value`             | `string`                                                 | -                   | Assembled value (controlled).                                             |
