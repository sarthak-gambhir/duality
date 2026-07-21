import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Badge, Button } from "../../src";

const meta: Meta<typeof Badge> = {
  title: "Display/Badge",
  component: Badge,
  args: { children: "Badge" },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-2)" }}>
      <Badge variant="solid">Solid</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

export const Dot: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-2)" }}>
      <Badge dot variant="solid">
        Active
      </Badge>
      <Badge dot variant="outline">
        Offline
      </Badge>
    </div>
  ),
};

export const Count: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
      <Badge count={3} />
      <Badge count={128} max={99} />
      <Badge count={0} showZero variant="outline" />
    </div>
  ),
};

const INITIAL_TAGS = [
  { id: "design", label: "Design", variant: "outline" as const },
  { id: "engineering", label: "Engineering", variant: "solid" as const },
];

function RemovableDemo() {
  const [tags, setTags] = useState(INITIAL_TAGS);
  if (tags.length === 0) {
    return (
      <Button size="sm" onClick={() => setTags(INITIAL_TAGS)}>
        Reset tags
      </Button>
    );
  }
  return (
    <div style={{ display: "flex", gap: "var(--space-2)" }}>
      {tags.map((tag) => (
        <Badge
          key={tag.id}
          variant={tag.variant}
          onRemove={() =>
            setTags((prev) => prev.filter((t) => t.id !== tag.id))
          }
        >
          {tag.label}
        </Badge>
      ))}
    </div>
  );
}

export const Removable: Story = {
  render: () => <RemovableDemo />,
};
