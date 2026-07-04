import type { Meta, StoryObj } from '@storybook/react';
import { Inline, Skeleton, Spinner, Stack } from '../../src';

const meta: Meta = {
  title: 'Data/Spinner & Skeleton',
};

export default meta;
type Story = StoryObj;

export const Spinners: Story = {
  render: () => (
    <Inline gap={4}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </Inline>
  ),
};

export const Skeletons: Story = {
  render: () => (
    <Stack gap={2} style={{ maxWidth: 320 }}>
      <Skeleton height={24} width="60%" />
      <Skeleton />
      <Skeleton />
      <Skeleton width="80%" />
    </Stack>
  ),
};
