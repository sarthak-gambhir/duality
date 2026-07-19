import type { Meta, StoryObj } from "@storybook/react";
import { Progress, Stack } from "../../src";

const meta: Meta<typeof Progress> = {
  title: "Display/Progress",
  component: Progress,
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const States: Story = {
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
