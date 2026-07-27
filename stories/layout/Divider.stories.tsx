import type { Meta, StoryObj } from "@storybook/react";
import { Divider } from "../../src";

const meta: Meta<typeof Divider> = {
  title: "Layout/Divider",
  component: Divider,
  parameters: {
    docs: {
      description: {
        component:
          "A one-pixel-family rule in the foreground color. Unlabeled horizontal dividers " +
          "render a semantic `<hr>`; add a `label` for a centered caption, or `decorative` " +
          "to drop the `separator` role.",
      },
    },
  },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    label: { control: "text" },
    decorative: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {
  render: () => (
    <div>
      <p>Above</p>
      <Divider />
      <p>Below</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-3)", height: 40 }}>
      <span>Left</span>
      <Divider orientation="vertical" />
      <span>Right</span>
    </div>
  ),
};

export const Labeled: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <div>
        <p>Section one</p>
        <Divider label="OR" />
        <p>Section two</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "A labeled divider renders a `div` (an `<hr>` cannot hold a label).",
      },
    },
  },
};
