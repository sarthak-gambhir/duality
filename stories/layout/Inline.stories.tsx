import type { Meta, StoryObj } from "@storybook/react";
import { Inline } from "../../src";
import { Cell } from "./_demo";

const meta: Meta<typeof Inline> = {
  title: "Layout/Inline",
  component: Inline,
  args: { gap: 3, align: "center", wrap: true },
};

export default meta;
type Story = StoryObj<typeof Inline>;

export const Default: Story = {
  render: (args) => (
    <Inline {...args}>
      <Cell>One</Cell>
      <Cell>Two</Cell>
      <Cell>Three</Cell>
      <Cell>Four</Cell>
    </Inline>
  ),
};
