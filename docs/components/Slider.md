# Slider

Two-color range slider built on a native `input[type=range]`.

## Props

| Prop            | Type                          | Default            | Description                                                             |
| --------------- | ----------------------------- | ------------------ | ----------------------------------------------------------------------- |
| `formatValue`   | `((value: number) => string)` | `(v) => String(v)` | Formats the value bubble and limit labels. Defaults to `String(value)`. |
| `invalid`       | `boolean`                     | -                  | Marks the control invalid.                                              |
| `marks`         | `SliderMark[]`                | -                  | Tick marks rendered along the track.                                    |
| `maxLabel`      | `ReactNode`                   | -                  | Label shown under the end of the track.                                 |
| `minLabel`      | `ReactNode`                   | -                  | Label shown under the start of the track.                               |
| `onValueChange` | `((value: number) => void)`   | -                  | Called with the new numeric value (alongside native `onChange`).        |
| `showValue`     | `boolean`                     | -                  | Show a value bubble above the thumb.                                    |
