# DatePicker

Two-color date picker: a Select-like trigger opens an anchored calendar grid. Native `Date` only; today is marked by a border (not color), the selected day inverts, and the grid supports full keyboard navigation.

## Props

| Prop                | Type                              | Default                                                                                | Description                                                              |
| ------------------- | --------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `aria-describedby`  | `string`                          | -                                                                                      |                                                                          |
| `aria-errormessage` | `string`                          | -                                                                                      |                                                                          |
| `aria-invalid`      | `boolean`                         | -                                                                                      |                                                                          |
| `aria-label`        | `string`                          | -                                                                                      |                                                                          |
| `aria-labelledby`   | `string`                          | -                                                                                      |                                                                          |
| `aria-required`     | `boolean`                         | -                                                                                      |                                                                          |
| `className`         | `string`                          | -                                                                                      |                                                                          |
| `clearable`         | `boolean`                         | -                                                                                      | Show a clear affordance and a "Clear" footer action.                     |
| `defaultOpen`       | `boolean`                         | -                                                                                      | Initial open state (uncontrolled).                                       |
| `defaultValue`      | `Date \| null`                    | -                                                                                      | Initial date (uncontrolled).                                             |
| `disabled`          | `boolean`                         | -                                                                                      |                                                                          |
| `disabledReason`    | `ReactNode`                       | -                                                                                      | When disabled, reason shown in a persistent caption below the field.     |
| `format`            | `((date: Date) => string)`        | `` (d: Date) =>   `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` `` | Formats the value shown in the trigger. Defaults to ISO `yyyy-mm-dd`.    |
| `id`                | `string`                          | -                                                                                      |                                                                          |
| `invalid`           | `boolean`                         | -                                                                                      | Marks the field invalid.                                                 |
| `isDateDisabled`    | `((date: Date) => boolean)`       | -                                                                                      | Predicate to disable specific dates.                                     |
| `max`               | `Date`                            | -                                                                                      | Latest selectable date.                                                  |
| `min`               | `Date`                            | -                                                                                      | Earliest selectable date.                                                |
| `name`              | `string`                          | -                                                                                      |                                                                          |
| `onOpenChange`      | `((open: boolean) => void)`       | -                                                                                      | Called when the open state should change.                                |
| `onValueChange`     | `((value: Date \| null) => void)` | -                                                                                      | Called with the newly selected date.                                     |
| `open`              | `boolean`                         | -                                                                                      | Whether the calendar is open (controlled).                               |
| `placeholder`       | `string`                          | `Select date...`                                                                       | Text shown when no date is selected.                                     |
| `size`              | `"sm" \| "md" \| "lg"`            | `md`                                                                                   | Control size.                                                            |
| `value`             | `Date \| null`                    | -                                                                                      | Selected date (controlled).                                              |
| `weekStartsOn`      | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `0`                                                                                    | First day of the week (0 = Sunday ... 6 = Saturday). Defaults to Sunday. |
