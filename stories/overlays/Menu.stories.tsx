import type { Meta, StoryObj } from '@storybook/react';
import { Button, Menu, MenuItem, MenuSeparator } from '../../src';

const meta: Meta<typeof Menu> = {
  title: 'Overlays/Menu',
  component: Menu,
};

export default meta;
type Story = StoryObj<typeof Menu>;

export const Default: Story = {
  render: () => (
    <Menu trigger={<Button>Actions</Button>} aria-label="Actions">
      <MenuItem onSelect={() => {}}>Edit</MenuItem>
      <MenuItem onSelect={() => {}}>Duplicate</MenuItem>
      <MenuSeparator />
      <MenuItem disabled>Archive (disabled)</MenuItem>
      <MenuItem onSelect={() => {}}>Delete</MenuItem>
    </Menu>
  ),
};
