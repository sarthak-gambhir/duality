import type { Meta, StoryObj } from "@storybook/react";
import { Inline, Stat } from "../../src";

const meta: Meta<typeof Stat> = {
  title: "Display/Stat",
  component: Stat,
};

export default meta;
type Story = StoryObj<typeof Stat>;

export const Default: Story = {
  render: () => (
    <Stat
      label="Active users"
      value="12,480"
      delta="+8.2%"
      deltaDirection="up"
    />
  ),
};

export const Group: Story = {
  render: () => (
    <Inline gap={4}>
      <Stat label="Revenue" value="$48.2k" delta="+12%" deltaDirection="up" />
      <Stat label="Churn" value="2.1%" delta="-0.4%" deltaDirection="down" />
      <Stat
        label="Sessions"
        value="9,032"
        delta="0%"
        deltaDirection="neutral"
      />
    </Inline>
  ),
};
