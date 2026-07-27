# RadioGroup

Groups Radio inputs, managing shared name/value/onChange.

## Props

| Prop            | Type                         | Default    | Description                                           |
| --------------- | ---------------------------- | ---------- | ----------------------------------------------------- |
| `defaultValue`  | `string`                     | -          | Initial selected value (uncontrolled).                |
| `disabled`      | `boolean`                    | -          | Disables every radio in the group.                    |
| `label`         | `ReactNode`                  | -          | Accessible group label.                               |
| `name`          | `string`                     | -          | Shared input name. Auto-generated when omitted.       |
| `onValueChange` | `((value: string) => void)`  | -          | Called with the newly selected value.                 |
| `orientation`   | `"horizontal" \| "vertical"` | `vertical` | Layout direction of the radios. Defaults to vertical. |
| `value`         | `string`                     | -          | Selected value (controlled).                          |
