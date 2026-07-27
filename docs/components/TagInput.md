# TagInput

Token entry field. Type and press Enter or comma to add a chip; remove via the chip button or Backspace on an empty field. Chips reuse the Badge.

## Props

| Prop                | Type                         | Default | Description                                                          |
| ------------------- | ---------------------------- | ------- | -------------------------------------------------------------------- |
| `allowDuplicates`   | `boolean`                    | `false` | Allow the same tag more than once. Defaults to false.                |
| `aria-describedby`  | `string`                     | -       |                                                                      |
| `aria-errormessage` | `string`                     | -       |                                                                      |
| `aria-invalid`      | `boolean`                    | -       |                                                                      |
| `aria-label`        | `string`                     | -       |                                                                      |
| `aria-labelledby`   | `string`                     | -       |                                                                      |
| `aria-required`     | `boolean`                    | -       |                                                                      |
| `className`         | `string`                     | -       |                                                                      |
| `defaultValue`      | `string[]`                   | -       | Initial tags (uncontrolled).                                         |
| `disabled`          | `boolean`                    | -       | Disable the whole control.                                           |
| `disabledReason`    | `ReactNode`                  | -       | When disabled, reason shown in a persistent caption below the field. |
| `id`                | `string`                     | -       |                                                                      |
| `invalid`           | `boolean`                    | -       | Mark invalid (dashed border + `aria-invalid`).                       |
| `max`               | `number`                     | -       | Maximum number of tags.                                              |
| `name`              | `string`                     | -       | Name for hidden inputs so tags submit with a form (one per tag).     |
| `onValueChange`     | `((tags: string[]) => void)` | -       | Called with the new tag list.                                        |
| `placeholder`       | `string`                     | -       | Placeholder shown in the text field.                                 |
| `value`             | `string[]`                   | -       | Current tags (controlled).                                           |
