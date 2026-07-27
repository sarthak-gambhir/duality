# Pagination

Page navigation with prev/next and a windowed set of page buttons.

## Props

| Prop                      | Type                     | Default   | Description                                                    |
| ------------------------- | ------------------------ | --------- | -------------------------------------------------------------- |
| `boundaryCount`           | `number`                 | `1`       | Pages always shown at the start and end. Defaults to 1.        |
| `count` (required)        | `number`                 | -         | Total number of pages.                                         |
| `disabled`                | `boolean`                | `false`   | Disable the entire control.                                    |
| `onPageChange` (required) | `(page: number) => void` | -         | Called with the requested page.                                |
| `page` (required)         | `number`                 | -         | Current page (1-based).                                        |
| `showEdges`               | `boolean`                | `false`   | Render first/last-page jump buttons. Defaults to false.        |
| `siblingCount`            | `number`                 | `1`       | Pages to show on each side of the current page. Defaults to 1. |
| `variant`                 | `"default" \| "compact"` | `default` | `compact` shows only prev/next with a "Page X of Y" readout.   |
