import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "../../src";

const meta: Meta<typeof Text> = {
  title: "Typography/Text",
  component: Text,
  args: { size: "md", children: "The quick brown fox." },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--space-2)" }}>
      <Text size="sm">Small text</Text>
      <Text size="md">Medium text</Text>
      <Text size="lg">Large text</Text>
      <Text size="xl">Extra-large text</Text>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--space-2)" }}>
      <Text weight="bold">Bold text</Text>
      <Text mono>Monospace text</Text>
    </div>
  ),
};
