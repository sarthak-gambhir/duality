# MultiSelect

Multi-value combobox: selected options show as removable chips.

## Props

| Prop                 | Type                                                       | Default     | Description                                                               |
| -------------------- | ---------------------------------------------------------- | ----------- | ------------------------------------------------------------------------- |
| `aria-describedby`   | `string`                                                   | -           |                                                                           |
| `aria-errormessage`  | `string`                                                   | -           |                                                                           |
| `aria-invalid`       | `boolean`                                                  | -           |                                                                           |
| `aria-label`         | `string`                                                   | -           |                                                                           |
| `aria-labelledby`    | `string`                                                   | -           |                                                                           |
| `aria-required`      | `boolean`                                                  | -           |                                                                           |
| `className`          | `string`                                                   | -           |                                                                           |
| `defaultOpen`        | `boolean`                                                  | -           | Initial open state (uncontrolled).                                        |
| `defaultValue`       | `string[]`                                                 | -           | Initial selected values (uncontrolled).                                   |
| `disabled`           | `boolean`                                                  | -           |                                                                           |
| `disabledReason`     | `ReactNode`                                                | -           | When disabled, reason shown in a persistent caption below the field.      |
| `id`                 | `string`                                                   | -           |                                                                           |
| `invalid`            | `boolean`                                                  | -           | Marks the field invalid (dashed border + `aria-invalid`).                 |
| `name`               | `string`                                                   | -           | When set, each selected value is mirrored to a hidden input of this name. |
| `onBlur`             | `((event: FocusEvent<HTMLInputElement, Element>) => void)` | -           | Called when the text input loses focus (for form-library integration).    |
| `onOpenChange`       | `((open: boolean) => void)`                                | -           | Called when the open state should change.                                 |
| `onValueChange`      | `((value: string[]) => void)`                              | -           | Called with the next array of selected values.                            |
| `open`               | `boolean`                                                  | -           | Whether the listbox is open (controlled).                                 |
| `options` (required) | `SelectOption[]`                                           | -           | Options to choose from.                                                   |
| `placeholder`        | `string`                                                   | `Select...` | Placeholder shown when nothing is selected.                               |
| `value`              | `string[]`                                                 | -           | Selected values (controlled).                                             |
