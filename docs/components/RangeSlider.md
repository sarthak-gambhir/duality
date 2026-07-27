# RangeSlider

Two-color dual-thumb range slider. Each thumb is a `role="slider"` control with full keyboard support; a fill spans between them. Thumbs can't cross.

## Props

| Prop                    | Type                                                 | Default            | Description                                                                                                                                   |
| ----------------------- | ---------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultValue`          | `Range`                                              | -                  | Initial `[low, high]` values (uncontrolled).                                                                                                  |
| `disabled`              | `boolean`                                            | -                  |                                                                                                                                               |
| `formatValue`           | `((value: number) => string)`                        | `(v) => String(v)` | Formats visible value/limit labels. Defaults to `String(value)`.                                                                              |
| `getAriaValueText`      | `((value: number, thumb: "max" \| "min") => string)` | -                  | Produces `aria-valuetext` for each thumb.                                                                                                     |
| `invalid`               | `boolean`                                            | -                  |                                                                                                                                               |
| `largeStep`             | `number`                                             | -                  | Step applied by PageUp/PageDown. Defaults to `step * 10`.                                                                                     |
| `marks`                 | `RangeSliderMark[]`                                  | -                  | Tick marks rendered along the track.                                                                                                          |
| `max`                   | `number`                                             | `100`              |                                                                                                                                               |
| `maxLabel`              | `string`                                             | `Maximum`          | Accessible label for the upper thumb.                                                                                                         |
| `min`                   | `number`                                             | `0`                |                                                                                                                                               |
| `minLabel`              | `string`                                             | `Minimum`          | Accessible label for the lower thumb.                                                                                                         |
| `minStepsBetweenThumbs` | `number`                                             | `0`                | Minimum number of steps that must remain between the two thumbs.                                                                              |
| `name`                  | `string`                                             | -                  | When set, the `[low, high]` values are mirrored to two hidden inputs of this name so the range participates in form submission (as an array). |
| `onValueChange`         | `((value: Range) => void)`                           | -                  | Called live with the new `[low, high]` values while dragging/keying.                                                                          |
| `onValueCommit`         | `((value: Range) => void)`                           | -                  | Called once at the end of an interaction (pointer up / key press).                                                                            |
| `showLimits`            | `boolean`                                            | -                  | Show the min/max bounds as labels under the track ends.                                                                                       |
| `showValues`            | `boolean`                                            | -                  | Show a visible value label above each thumb.                                                                                                  |
| `step`                  | `number`                                             | `1`                |                                                                                                                                               |
| `value`                 | `Range`                                              | -                  | Current `[low, high]` values (controlled).                                                                                                    |
