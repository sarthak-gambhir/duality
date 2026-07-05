import type { Meta, StoryObj } from '@storybook/react';
import { Progress, Stack } from '../../src';

const meta: Meta<typeof Progress> = {
  title: 'Display/Progress',
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
