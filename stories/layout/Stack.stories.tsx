import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "../../src";
import { Cell } from "./_demo";

const meta: Meta<typeof Stack> = {
  title: "Layout/Stack",
  component: Stack,
  args: { gap: 4 },
};

export default meta;
type Story = StoryObj<typeof Stack>;

export const Default: Story = {
  render: (args) => (
    <Stack {...args}>
      <Cell>One</Cell>
      <Cell>Two</Cell>
      <Cell>Three</Cell>
    </Stack>
  ),
};
