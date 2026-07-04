import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, Inline } from '../../src';

const meta: Meta<typeof Avatar> = {
  title: 'Data/Avatar',
  component: Avatar,
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Initials: Story = {
  render: () => (
    <Inline gap={3}>
      <Avatar name="Ada Lovelace" size="sm" />
      <Avatar name="Alan Turing" size="md" />
      <Avatar name="Grace Hopper" size="lg" />
    </Inline>
  ),
};
