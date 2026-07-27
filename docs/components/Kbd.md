# Kbd

Keyboard key hint with a pixel border. Pass `keys` to render a combo.

## Props

| Prop        | Type        | Default | Description                                                 |
| ----------- | ----------- | ------- | ----------------------------------------------------------- |
| `keys`      | `string[]`  | -       | Render a key combo: each entry becomes its own `<kbd>` cap. |
| `separator` | `ReactNode` | `+`     | Separator shown between combo keys. Defaults to `"+"`.      |
