import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RiFileLine, RiFolderLine } from "react-icons/ri";
import { Icon, Tree, type TreeNode } from "../../src";

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

const iconItems: TreeNode[] = [
  {
    id: "src",
    label: "src",
    icon: <Icon icon={RiFolderLine} />,
    children: [
      {
        id: "components",
        label: "components",
        icon: <Icon icon={RiFolderLine} />,
        children: [
          { id: "button", label: "Button.tsx", icon: <Icon icon={RiFileLine} /> },
          { id: "tree", label: "Tree.tsx", icon: <Icon icon={RiFileLine} /> },
        ],
      },
      { id: "index", label: "index.ts", icon: <Icon icon={RiFileLine} /> },
    ],
  },
  { id: "readme", label: "README.md", icon: <Icon icon={RiFileLine} /> },
];

export const WithIcons: Story = {
  render: () => (
    <Tree items={iconItems} label="Files with icons" defaultExpandAll />
  ),
};

export const ExpandAll: Story = {
  render: () => <Tree items={items} label="Files" defaultExpandAll />,
};
