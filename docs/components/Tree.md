# Tree

Data-driven tree. `role="tree"` with roving focus over the visible nodes: Up/Down move, Right expands or descends, Left collapses or ascends, Home/End jump, Enter/Space select. Selection inverts the row (never color alone).

## Props

| Prop               | Type                        | Default | Description                                                    |
| ------------------ | --------------------------- | ------- | -------------------------------------------------------------- |
| `defaultExpandAll` | `boolean`                   | -       | Expand every parent node initially (uncontrolled convenience). |
| `defaultExpanded`  | `string[]`                  | -       | Initially expanded node ids (uncontrolled).                    |
| `defaultSelected`  | `string`                    | -       | Initially selected node id (uncontrolled).                     |
| `expanded`         | `string[]`                  | -       | Expanded node ids (controlled).                                |
| `items` (required) | `TreeNode[]`                | -       | Tree data.                                                     |
| `label`            | `string`                    | -       | Accessible tree label.                                         |
| `onExpandedChange` | `((ids: string[]) => void)` | -       | Called with the new set of expanded ids.                       |
| `onSelectedChange` | `((id: string) => void)`    | -       | Called with the newly selected id.                             |
| `selected`         | `string`                    | -       | Selected node id (controlled).                                 |
