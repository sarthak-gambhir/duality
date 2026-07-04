import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../src";

const meta: Meta<typeof Button> = {
  title: "Controls/Button",
  component: Button,
  args: { children: "Button", variant: "solid", size: "md" },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-3)" }}>
      <Button variant="solid">Solid</Button>
      <Button variant="inverse">Inverse</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div
      style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}
    >
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};
