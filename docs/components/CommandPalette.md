# CommandPalette

Searchable command menu in a portaled dialog. Type to filter, arrow keys to move, Enter to run, Escape to close. Follows the two-color model.

## Props

| Prop                  | Type         | Default                       | Description                                                          |
| --------------------- | ------------ | ----------------------------- | -------------------------------------------------------------------- |
| `aria-label`          | `string`     | `Command palette`             | Accessible name for the dialog.                                      |
| `className`           | `string`     | -                             |                                                                      |
| `commands` (required) | `Command[]`  | -                             | Commands to search and run.                                          |
| `emptyMessage`        | `string`     | `No commands`                 | Message shown when nothing matches.                                  |
| `isOpen` (required)   | `boolean`    | -                             | Whether the palette is open.                                         |
| `onClose` (required)  | `() => void` | -                             | Called when the palette requests to close (Escape or outside press). |
| `placeholder`         | `string`     | `Type a command or search...` | Placeholder for the search input.                                    |
| `recentIds`           | `string[]`   | -                             | Ids surfaced under a "Recent" group when the query is empty.         |
