# SideNav

Sidebar navigation with optional section headings and an active item.

## Props

| Prop         | Type               | Default   | Description                                                                                                                                      |
| ------------ | ------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `activeId`   | `string`           | -         | Id of the current item; gets `aria-current="page"` and inverts.                                                                                  |
| `aria-label` | `string`           | `Sidebar` | Accessible name for the nav landmark.                                                                                                            |
| `className`  | `string`           | -         |                                                                                                                                                  |
| `collapsed`  | `boolean`          | -         | Rail mode: show each item's label (and badge) as a hover/focus tooltip. Pair with a collapsed `Sidebar`, which visually hides the inline labels. |
| `items`      | `SideNavItem[]`    | -         | Flat list of items (used when `sections` is omitted).                                                                                            |
| `sections`   | `SideNavSection[]` | -         | Grouped items with optional headings.                                                                                                            |
