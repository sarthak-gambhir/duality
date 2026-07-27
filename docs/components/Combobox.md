# Combobox

Editable ARIA combobox over a filtered listbox. Follows the two-color model and reuses the Select listbox styling; a hidden input mirrors the value.

## Props

| Prop                 | Type                                                 | Default | Description                                                            |
| -------------------- | ---------------------------------------------------- | ------- | ---------------------------------------------------------------------- |
| `defaultOpen`        | `boolean`                                            | -       | Initial open state (uncontrolled).                                     |
| `defaultValue`       | `string`                                             | -       | Initial selected value (uncontrolled).                                 |
| `disabledReason`     | `ReactNode`                                          | -       | When disabled, reason shown in a persistent caption below the field.   |
| `filter`             | `((option: SelectOption, query: string) => boolean)` | -       | Custom filter predicate. Defaults to case-insensitive substring match. |
| `inputValue`         | `string`                                             | -       | Text in the input (controlled).                                        |
| `invalid`            | `boolean`                                            | -       | Marks the field invalid (dashed border + `aria-invalid`).              |
| `name`               | `string`                                             | -       | Name of a hidden input so the value participates in form submission.   |
| `onInputValueChange` | `((value: string) => void)`                          | -       | Called when the input text changes.                                    |
| `onOpenChange`       | `((open: boolean) => void)`                          | -       | Called when the open state should change.                              |
| `onValueChange`      | `((value: string) => void)`                          | -       | Called with the newly selected value.                                  |
| `open`               | `boolean`                                            | -       | Whether the listbox is open (controlled).                              |
| `options` (required) | `SelectOption[]`                                     | -       | Options to filter and choose from.                                     |
| `placeholder`        | `string`                                             | -       | Placeholder shown when the input is empty.                             |
| `size`               | `"sm" \| "md" \| "lg"`                               | `md`    | Control size.                                                          |
| `value`              | `string`                                             | -       | Selected value (controlled).                                           |
