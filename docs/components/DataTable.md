# DataTable

Sortable, filterable table built on the Table primitives. Generic over the row type; sortable headers toggle asc -> desc -> none, a live global filter narrows rows, and optional selection / pagination / loading states layer on top. Two-color states throughout.

## Props

| Prop                 | Type                                              | Default      | Description                                                    |
| -------------------- | ------------------------------------------------- | ------------ | -------------------------------------------------------------- |
| `aria-label`         | `string`                                          | -            | Accessible name for the table.                                 |
| `className`          | `string`                                          | -            |                                                                |
| `columns` (required) | `DataTableColumn<T>[]`                            | -            | Column definitions.                                            |
| `data` (required)    | `T[]`                                             | -            | Row data.                                                      |
| `defaultSelectedIds` | `RowId[]`                                         | -            | Initially selected row ids (uncontrolled).                     |
| `emptyMessage`       | `string`                                          | `No results` | Message shown when no rows match.                              |
| `filterable`         | `boolean`                                         | `true`       | Show the global filter input. Defaults to true.                |
| `filterPlaceholder`  | `string`                                          | `Filter...`  | Placeholder for the filter input.                              |
| `getRowId`           | `((row: T, index: number) => RowId)`              | -            | Stable row key. Defaults to the row index.                     |
| `initialSort`        | `{ columnId: string; direction: SortDirection; }` | -            | Initial sort state.                                            |
| `isLoading`          | `boolean`                                         | `false`      | Show placeholder skeleton rows instead of data.                |
| `loadingRowCount`    | `number`                                          | `5`          | Number of skeleton rows when loading. Defaults to 5.           |
| `maxHeight`          | `string \| number`                                | -            | Max height of the scroll container (used with `stickyHeader`). |
| `onRowClick`         | `((row: T) => void)`                              | -            | Called when a row is activated (click / Enter / Space).        |
| `onSelectionChange`  | `((ids: RowId[]) => void)`                        | -            | Called with the new set of selected ids.                       |
| `pageSize`           | `number`                                          | -            | Rows per page. Enables client-side pagination when set.        |
| `selectable`         | `boolean`                                         | `false`      | Enable a leading selection checkbox column.                    |
| `selectedIds`        | `RowId[]`                                         | -            | Selected row ids (controlled).                                 |
| `size`               | `"sm" \| "md" \| "lg"`                            | -            | Cell padding scale, forwarded to the underlying table.         |
| `stickyHeader`       | `boolean`                                         | `false`      | Pin the header while the body scrolls.                         |
