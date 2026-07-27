# ThemeProvider

Establishes a Duality theme scope. Renders a `du_theme_root` element carrying `data-theme`, `data-density`, and `data-texture`, which the tokens stylesheet uses to resolve `--fg` / `--bg`, the spacing / sizing scale, and the texture fill. Requires `import '@astrabound/duality/styles.css'` once in the app.

## Props

| Prop             | Type                                                                                                                 | Default       | Description                                                                                                      |
| ---------------- | -------------------------------------------------------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------- |
| `className`      | `string`                                                                                                             | -             |                                                                                                                  |
| `defaultDensity` | `"compact" \| "comfortable"`                                                                                         | `comfortable` | Initial spacing/sizing density. Defaults to `comfortable`.                                                       |
| `defaultTexture` | `"dither" \| "hatch"`                                                                                                | `dither`      | Initial texture fill. Defaults to `dither`.                                                                      |
| `defaultTheme`   | `"classic" \| "dark" \| "paper" \| "slate" \| "sepia" \| "amber" \| "phosphor" \| "blueprint" \| "teal" \| "sakura"` | `classic`     | Initial theme. Defaults to `classic`.                                                                            |
| `storageKey`     | `string`                                                                                                             | -             | When set, the active theme and density are persisted to `localStorage` under this key and restored on next load. |
