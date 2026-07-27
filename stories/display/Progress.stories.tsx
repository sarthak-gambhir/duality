import type { Meta, StoryObj } from "@storybook/react";
import { Progress, Stack } from "../../src";

const meta: Meta<typeof Progress> = {
  title: "Display/Progress",
  component: Progress,
  parameters: {
    docs: {
      description: {
        component:
          "Two-color progress bar. Set `value`/`max`, or `indeterminate` for an animated unknown-progress fill; `showValue` renders a formatted label.",
      },
    },
  },
  argTypes: {
    value: {
      control: "number",
      description: "Current value (ignored when indeterminate).",
    },
    max: {
      control: "number",
      description: "Maximum value.",
      table: { defaultValue: { summary: "100" } },
    },
    indeterminate: {
      control: "boolean",
      description: "Unknown-progress mode with an animated fill.",
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
      description: "Control height.",
      table: { defaultValue: { summary: "sm" } },
    },
    showValue: {
      control: "boolean",
      description: "Show a value label beside the bar.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  render: () => (
    <Stack gap={4}>
      <Progress value={25} aria-label="25 percent" />
      <Progress value={70} aria-label="70 percent" />
      <Progress indeterminate aria-label="Loading" />
    </Stack>
  ),
};

export const WithValue: Story = {
  render: () => (
    <Stack gap={4}>
      <Progress value={40} showValue aria-label="Upload" />
      <Progress
        value={3}
        max={5}
        showValue
        formatValue={(v, m) => `${v}/${m}`}
        aria-label="Steps"
      />
    </Stack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Stack gap={4}>
      <Progress value={60} size="sm" aria-label="Small" />
      <Progress value={60} size="md" aria-label="Medium" />
      <Progress value={60} size="lg" aria-label="Large" />
    </Stack>
  ),
};
