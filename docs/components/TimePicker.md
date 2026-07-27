# TimePicker

Two-color time picker: a Select-like trigger opens hour and minute listbox columns (plus AM/PM in 12h mode). Value is `"HH:mm"` in 24h; selected cells invert rather than relying on color.

## Props

| Prop                | Type                                                  | Default          | Description                                                              |
| ------------------- | ----------------------------------------------------- | ---------------- | ------------------------------------------------------------------------ |
| `aria-describedby`  | `string`                                              | -                |                                                                          |
| `aria-errormessage` | `string`                                              | -                |                                                                          |
| `aria-invalid`      | `boolean`                                             | -                |                                                                          |
| `aria-label`        | `string`                                              | -                |                                                                          |
| `aria-labelledby`   | `string`                                              | -                |                                                                          |
| `aria-required`     | `boolean`                                             | -                |                                                                          |
| `className`         | `string`                                              | -                |                                                                          |
| `clearable`         | `boolean`                                             | -                | Show a clear affordance beside the trigger.                              |
| `defaultOpen`       | `boolean`                                             | -                | Initial open state (uncontrolled).                                       |
| `defaultValue`      | `string \| null`                                      | -                | Initial time as `"HH:mm"` (uncontrolled).                                |
| `disabled`          | `boolean`                                             | -                |                                                                          |
| `disabledHours`     | `((hour: number) => boolean)`                         | -                | Predicate to disable specific hours (24h value).                         |
| `disabledMinutes`   | `((minute: number, hour: number \| null) => boolean)` | -                | Predicate to disable specific minutes (given the active 24h hour).       |
| `disabledReason`    | `ReactNode`                                           | -                | When disabled, reason shown in a persistent caption below the field.     |
| `hour12`            | `boolean`                                             | `false`          | Use a 12-hour clock with an AM/PM column. Defaults to false (24h).       |
| `id`                | `string`                                              | -                |                                                                          |
| `invalid`           | `boolean`                                             | -                | Marks the field invalid.                                                 |
| `max`               | `string`                                              | -                | Latest selectable time as `"HH:mm"`.                                     |
| `min`               | `string`                                              | -                | Earliest selectable time as `"HH:mm"`.                                   |
| `name`              | `string`                                              | -                |                                                                          |
| `onOpenChange`      | `((open: boolean) => void)`                           | -                | Called when the open state should change.                                |
| `onValueChange`     | `((value: string \| null) => void)`                   | -                | Called with the newly selected `"HH:mm"` value (or `null` when cleared). |
| `open`              | `boolean`                                             | -                | Whether the panel is open (controlled).                                  |
| `placeholder`       | `string`                                              | `Select time...` | Text shown when nothing is selected.                                     |
| `size`              | `"sm" \| "md" \| "lg"`                                | `md`             | Control size.                                                            |
| `step`              | `number`                                              | `5`              | Minute increment for the minute column. Defaults to 5.                   |
| `value`             | `string \| null`                                      | -                | Selected time as `"HH:mm"` (24h, controlled).                            |
