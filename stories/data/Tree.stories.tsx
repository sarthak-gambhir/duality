import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tree, type TreeNode } from "../../src";

const meta: Meta<typeof Tree> = {
  title: "Data/Tree",
  component: Tree,
};

export default meta;
type Story = StoryObj<typeof Tree>;

const items: TreeNode[] = [
  {
    id: "src",
    label: "src",
    children: [
      {
        id: "components",
        label: "components",
        children: [
          { id: "button", label: "Button.tsx" },
          { id: "tree", label: "Tree.tsx" },
        ],
      },
      { id: "index", label: "index.ts" },
    ],
  },
  {
    id: "docs",
    label: "docs",
    children: [{ id: "readme", label: "README.md", disabled: true }],
  },
  { id: "license", label: "LICENSE" },
];

function Demo() {
  const [selected, setSelected] = useState<string>("button");
  return (
    <Tree
      items={items}
      label="Files"
      defaultExpanded={["src", "components"]}
      selected={selected}
      onSelectedChange={setSelected}
    />
  );
}

export const Default: Story = { render: () => <Demo /> };
