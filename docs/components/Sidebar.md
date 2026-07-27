# Sidebar

Persistent, in-flow navigation rail that toggles between an expanded (icon + label) and collapsed (icon-only) width. A thin composition shell - put a `SideNav` (and brand/user chrome) inside it. Responsive behavior is the app's responsibility (e.g. render the `SideNav` in a `Drawer` on mobile).

## Props

| Prop                | Type                             | Default   | Description                                                                                                                                          |
| ------------------- | -------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `aria-label`        | `string`                         | `Sidebar` | Accessible name for the landmark. Defaults to "Sidebar".                                                                                             |
| `className`         | `string`                         | -         |                                                                                                                                                      |
| `collapsed`         | `boolean`                        | -         | Controlled collapsed state.                                                                                                                          |
| `collapsedWidth`    | `number`                         | `64`      | Collapsed (rail) width in px. Defaults to 64.                                                                                                        |
| `collapsible`       | `boolean`                        | `true`    | Whether the sidebar can collapse. When `false` it stays expanded, ignores collapse requests, and `SidebarTrigger` renders nothing. Defaults to true. |
| `defaultCollapsed`  | `boolean`                        | `false`   | Initial collapsed state (uncontrolled). Defaults to false.                                                                                           |
| `onCollapsedChange` | `((collapsed: boolean) => void)` | -         | Called when the collapsed state changes.                                                                                                             |
| `style`             | `CSSProperties`                  | -         |                                                                                                                                                      |
| `width`             | `number`                         | `260`     | Expanded width in px. Defaults to 260.                                                                                                               |
