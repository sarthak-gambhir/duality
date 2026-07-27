# ContextMenu

Right-click menu opened at the cursor, clamped to the viewport.

## Props

| Prop                  | Type                | Default        | Description                                |
| --------------------- | ------------------- | -------------- | ------------------------------------------ |
| `aria-label`          | `string`            | `Context menu` | Accessible name for the menu.              |
| `children` (required) | `ReactNode`         | -              | Region that opens the menu on right-click. |
| `className`           | `string`            | -              |                                            |
| `items` (required)    | `ContextMenuItem[]` | -              | Menu rows to show at the cursor.           |
