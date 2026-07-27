# Select

Custom two-color dropdown built on the ARIA combobox/listbox pattern, so the open list follows `--fg`/`--bg`, pixel borders, and inversion just like the rest of the system. A hidden input mirrors the value for form submission.

## Props

| Prop             | Type                        | Default     | Description                                                                                                                                                        |
| ---------------- | --------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `align`          | `"end" \| "start"`          | `start`     | Which edge the dropdown is anchored to relative to the trigger. Use `"end"` for triggers near the trailing edge so the list opens inward. Defaults to `"start"`.   |
| `children`       | `ReactNode`                 | -           | `<option>` elements (parsed when `options` is not provided).                                                                                                       |
| `defaultOpen`    | `boolean`                   | -           | Initial open state (uncontrolled).                                                                                                                                 |
| `defaultValue`   | `string`                    | -           | Initial value (uncontrolled).                                                                                                                                      |
| `disabledReason` | `ReactNode`                 | -           | When disabled, reason shown in a persistent caption below the field.                                                                                               |
| `invalid`        | `boolean`                   | -           | Marks the field invalid (border-style change + `aria-invalid`).                                                                                                    |
| `markAlign`      | `"end" \| "start"`          | `start`     | Which edge the selection marker sits on within each option. `"end"` moves it to the trailing edge with the label filling the leading space. Defaults to `"start"`. |
| `name`           | `string`                    | -           | Name of a hidden input so the value participates in form submission.                                                                                               |
| `onOpenChange`   | `((open: boolean) => void)` | -           | Called when the open state should change.                                                                                                                          |
| `onValueChange`  | `((value: string) => void)` | -           | Called with the newly selected value.                                                                                                                              |
| `open`           | `boolean`                   | -           | Whether the dropdown is open (controlled).                                                                                                                         |
| `options`        | `SelectOption[]`            | -           | Options to render. If omitted, `<option>` children are parsed instead.                                                                                             |
| `placeholder`    | `string`                    | `Select...` | Text shown when nothing is selected.                                                                                                                               |
| `size`           | `"sm" \| "md" \| "lg"`      | `md`        | Control size.                                                                                                                                                      |
| `value`          | `string`                    | -           | Selected value (controlled).                                                                                                                                       |
