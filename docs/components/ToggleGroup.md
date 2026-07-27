# ToggleGroup

Segmented control. `single` renders a `radiogroup` with roving focus; `multiple` renders a `group` of independent `aria-pressed` toggle buttons.

## Props

| Prop            | Type                             | Default  | Description                                                                                                                                         |
| --------------- | -------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultValue`  | `ToggleValue`                    | -        | Initial value(s) (uncontrolled).                                                                                                                    |
| `disabled`      | `boolean`                        | -        | Disables every item in the group.                                                                                                                   |
| `label`         | `ReactNode`                      | -        | Accessible group label.                                                                                                                             |
| `name`          | `string`                         | -        | When set, the selection is mirrored to hidden input(s) of this name so it participates in form submission (one input per value in `multiple` mode). |
| `onValueChange` | `((value: ToggleValue) => void)` | -        | Called with the new selection.                                                                                                                      |
| `type`          | `"single" \| "multiple"`         | `single` | Single selection (radio-like) or multiple (independent toggles).                                                                                    |
| `value`         | `ToggleValue`                    | -        | Selected value(s) (controlled).                                                                                                                     |
