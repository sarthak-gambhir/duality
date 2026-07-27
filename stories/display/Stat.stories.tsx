import type { Meta, StoryObj } from "@storybook/react";
import { Stat, StatGroup } from "../../src";

const meta: Meta<typeof Stat> = {
  title: "Display/Stat",
  component: Stat,
  parameters: {
    docs: {
      description: {
        component:
          "Compact metric display: a label, primary value, and an optional directional delta shown as an arrow shape (not color).",
      },
    },
  },
  argTypes: {
    label: { control: "text", description: "Descriptive label above the value." },
    value: { control: "text", description: "The primary metric." },
    delta: {
      control: "text",
      description: "Optional change indicator shown below the value.",
    },
    deltaDirection: {
      control: "inline-radio",
      options: ["up", "down", "neutral"],
      description: "Direction of the delta (arrow shape, not color).",
    },
  },
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

export const WithIcon: Story = {
  render: () => (
    <Stat
      label="Revenue"
      value="$48.2k"
      icon={<span aria-hidden="true">$</span>}
      delta="+12%"
      deltaDirection="up"
    />
  ),
};

export const Group: Story = {
  render: () => (
    <StatGroup style={{ maxWidth: 560 }}>
      <Stat label="Revenue" value="$48.2k" delta="+12%" deltaDirection="up" />
      <Stat label="Churn" value="2.1%" delta="-0.4%" deltaDirection="down" />
      <Stat
        label="Sessions"
        value="9,032"
        delta="0%"
        deltaDirection="neutral"
      />
    </StatGroup>
  ),
};
