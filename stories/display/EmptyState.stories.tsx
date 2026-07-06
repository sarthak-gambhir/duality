import type { Meta, StoryObj } from '@storybook/react';
import { Button, EmptyState } from '../../src';

const meta: Meta<typeof EmptyState> = {
  title: 'Display/EmptyState',
  component: EmptyState,
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  render: () => (
    <EmptyState
      title="No projects yet"
      description="Create your first project to start tracking work across your team."
      action={<Button>New project</Button>}
    />
  ),
};

export const TextOnly: Story = {
  render: () => (
    <EmptyState title="No results" description="Try adjusting your filters or search terms." />
  ),
};
