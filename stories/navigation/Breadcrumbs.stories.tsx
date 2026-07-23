import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RiDashboardLine, RiFolderLine, RiHome2Line } from "react-icons/ri";
import { Breadcrumbs, Button, Icon, Text } from "../../src";

const meta: Meta<typeof Breadcrumbs> = {
  title: "Navigation/Breadcrumbs",
  component: Breadcrumbs,
  parameters: {
    docs: {
      description: {
        component:
          "Hierarchical navigation trail in a `nav` landmark. The last crumb is the current page (`aria-current=\"page\"`); earlier crumbs are `Link`s (with `href`), buttons (with `onClick`, for SPA routing), or plain text. Set `maxItems` to collapse the middle into an overflow marker while always keeping the first crumb and the last `itemsAfterCollapse` crumbs. Each item may carry a leading `icon`.",
      },
    },
  },
  argTypes: {
    maxItems: {
      control: "number",
      description: "Collapse the middle when the trail exceeds this many crumbs.",
    },
    itemsBeforeCollapse: {
      control: "number",
      description: "Crumbs kept at the start when collapsed.",
      table: { defaultValue: { summary: "1" } },
    },
    itemsAfterCollapse: {
      control: "number",
      description: "Crumbs kept at the end when collapsed.",
      table: { defaultValue: { summary: "1" } },
    },
    separator: {
      control: false,
      description: "Node rendered between crumbs. Defaults to a chevron icon.",
    },
    items: {
      control: false,
      description:
        "Ordered crumbs (root -> current). Each: `{ label, href?, icon?, onClick? }`.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  render: () => (
    <Breadcrumbs
      items={[
        { label: "Home", href: "#" },
        { label: "Components", href: "#" },
        { label: "Breadcrumbs" },
      ]}
    />
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Breadcrumbs
      items={[
        { label: "Home", href: "#", icon: <Icon icon={RiHome2Line} /> },
        {
          label: "Dashboard",
          href: "#",
          icon: <Icon icon={RiDashboardLine} />,
        },
        { label: "Reports", icon: <Icon icon={RiFolderLine} /> },
      ]}
    />
  ),
};

const chain = [
  "Home",
  "Workspace",
  "Projects",
  "Duality",
  "Components",
  "Breadcrumbs",
];

function CollapsedDemo() {
  // Real breadcrumb navigation: `depth` is the current position in the chain.
  // Start deep so the middle collapses. Clicking an ancestor crumb navigates up
  // (the trail truncates to that level); the child button navigates down. All
  // state-driven, so nothing redirects the page.
  const [depth, setDepth] = useState(chain.length - 1);
  const items = chain.slice(0, depth + 1).map((label, index) => ({
    label,
    onClick: index < depth ? () => setDepth(index) : undefined,
  }));
  const child = depth < chain.length - 1 ? chain[depth + 1] : null;

  return (
    <div style={{ display: "grid", gap: "var(--space-3)" }}>
      <Breadcrumbs
        maxItems={4}
        itemsBeforeCollapse={1}
        itemsAfterCollapse={2}
        items={items}
      />
      <Text size="sm">
        Stage {depth + 1} of {chain.length}
      </Text>
      <Text size="sm">
        Full path:{" "}
        {chain.map((label, index) => (
          <span key={label}>
            {index > 0 && " / "}
            <span
              style={{
                fontWeight: index === depth ? "bold" : undefined,
                textDecoration: index === depth ? "underline" : undefined,
              }}
            >
              {label}
            </span>
          </span>
        ))}
      </Text>
      {child && (
        <div>
          <Button size="sm" onClick={() => setDepth(depth + 1)}>
            Open {child}
          </Button>
        </div>
      )}
    </div>
  );
}

export const Collapsed: Story = { render: () => <CollapsedDemo /> };

function InteractiveDemo() {
  const trail = ["Home", "Library", "Fiction", "Chapter 1"];
  const [depth, setDepth] = useState(trail.length - 1);
  const items = trail.slice(0, depth + 1).map((label, index) => ({
    label,
    onClick:
      index < depth ? () => setDepth(index) : undefined,
  }));
  return (
    <div style={{ display: "grid", gap: "var(--space-3)" }}>
      <Breadcrumbs items={items} />
      <Text size="sm">Current: {trail[depth]}</Text>
    </div>
  );
}

export const InteractiveOnClick: Story = { render: () => <InteractiveDemo /> };
