# Breadcrumbs

Hierarchical navigation trail; the last crumb is the current page.

## Props

| Prop                  | Type               | Default | Description                                                  |
| --------------------- | ------------------ | ------- | ------------------------------------------------------------ |
| `items` (required)    | `BreadcrumbItem[]` | -       | Ordered crumbs from root to current page.                    |
| `itemsAfterCollapse`  | `number`           | `1`     | Crumbs kept at the end when collapsed. Defaults to 1.        |
| `itemsBeforeCollapse` | `number`           | `1`     | Crumbs kept at the start when collapsed. Defaults to 1.      |
| `maxItems`            | `number`           | -       | Collapse the middle when the trail exceeds this many crumbs. |
| `separator`           | `ReactNode`        | -       | Separator between crumbs. Defaults to a chevron icon.        |
