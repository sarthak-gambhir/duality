import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumbs } from '../../src';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  render: () => (
    <Breadcrumbs
      items={[
        { label: 'Home', href: '#' },
        { label: 'Components', href: '#' },
        { label: 'Breadcrumbs' },
      ]}
    />
  ),
};
