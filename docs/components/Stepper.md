# Stepper

Progress indicator for a multi-step flow. Steps are numbered pixel markers; completed steps show a check, the current step is filled, upcoming steps are outlined, and error/warning steps swap in a tone glyph - status is never conveyed by color alone.

## Props

| Prop                    | Type                         | Default      | Description                                                              |
| ----------------------- | ---------------------------- | ------------ | ------------------------------------------------------------------------ |
| `activeStep` (required) | `number`                     | -            | Index of the active (current) step.                                      |
| `allowAllSteps`         | `boolean`                    | `false`      | Allow clicking upcoming steps too (non-linear flows). Defaults to false. |
| `aria-label`            | `string`                     | -            | Accessible name for the step list.                                       |
| `className`             | `string`                     | -            |                                                                          |
| `onStepChange`          | `((index: number) => void)`  | -            | When provided, steps become clickable (see `allowAllSteps`).             |
| `orientation`           | `"horizontal" \| "vertical"` | `horizontal` | Layout direction. Defaults to horizontal.                                |
| `steps` (required)      | `StepperStep[]`              | -            | Ordered list of steps.                                                   |
