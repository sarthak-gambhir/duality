# NumberInput

Stepper number field: `-` / `+` buttons flank a `role="spinbutton"` input. Values clamp to `min`/`max` on commit; arrow keys and Home/End also step.

## Props

| Prop             | Type                        | Default | Description                                                          |
| ---------------- | --------------------------- | ------- | -------------------------------------------------------------------- |
| `defaultValue`   | `number`                    | -       | Initial value (uncontrolled).                                        |
| `disabledReason` | `ReactNode`                 | -       | When disabled, reason shown in a persistent caption below the field. |
| `hideSteppers`   | `boolean`                   | -       | Hide the increment/decrement buttons.                                |
| `invalid`        | `boolean`                   | -       | Marks the field invalid (dashed border + `aria-invalid`).            |
| `largeStep`      | `number`                    | -       | Step applied by PageUp/PageDown. Defaults to `step * 10`.            |
| `max`            | `number`                    | -       | Maximum allowed value.                                               |
| `min`            | `number`                    | -       | Minimum allowed value.                                               |
| `name`           | `string`                    | -       | Name of a hidden input so the value participates in form submission. |
| `onValueChange`  | `((value: number) => void)` | -       | Called with the new numeric value (or `undefined` when cleared).     |
| `precision`      | `number`                    | -       | Decimal places to round to when committing.                          |
| `prefix`         | `ReactNode`                 | -       | Content rendered before the field (e.g. a currency symbol).          |
| `size`           | `"sm" \| "md" \| "lg"`      | `md`    | Control size.                                                        |
| `step`           | `number`                    | `1`     | Step applied by the buttons and arrow keys.                          |
| `suffix`         | `ReactNode`                 | -       | Content rendered after the field (e.g. a unit).                      |
| `value`          | `number`                    | -       | Current value (controlled).                                          |
