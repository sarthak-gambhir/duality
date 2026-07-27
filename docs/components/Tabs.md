# Tabs

Tabbed interface root. Provides selection state to Tab/TabPanel.

## Props

| Prop             | Type                         | Default      | Description                                                                                                                             |
| ---------------- | ---------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `activationMode` | `"automatic" \| "manual"`    | `automatic`  | Whether arrow keys select on focus (`automatic`) or only move focus (`manual`, activate with Enter/Space/click). Defaults to automatic. |
| `defaultValue`   | `string`                     | -            | Initial selected value (uncontrolled). Optional when fully controlled.                                                                  |
| `onValueChange`  | `((value: string) => void)`  | -            | Called with the newly selected value.                                                                                                   |
| `orientation`    | `"horizontal" \| "vertical"` | `horizontal` | Layout + arrow-key axis. Defaults to horizontal.                                                                                        |
| `value`          | `string`                     | -            | Selected tab value (controlled).                                                                                                        |
