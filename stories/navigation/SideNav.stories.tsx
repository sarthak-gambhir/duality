import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SideNav, type SideNavSection } from '../../src';

const meta: Meta<typeof SideNav> = {
  title: 'Navigation/SideNav',
  component: SideNav,
};

export default meta;
type Story = StoryObj<typeof SideNav>;

function Demo() {
  const [active, setActive] = useState('overview');
  const sections: SideNavSection[] = [
    {
      id: 'main',
      label: 'Workspace',
      items: [
        { id: 'overview', label: 'Overview', onSelect: () => setActive('overview') },
        { id: 'projects', label: 'Projects', onSelect: () => setActive('projects') },
        { id: 'tasks', label: 'Tasks', onSelect: () => setActive('tasks') },
      ],
    },
    {
      id: 'account',
      label: 'Account',
      items: [
        { id: 'settings', label: 'Settings', onSelect: () => setActive('settings') },
        { id: 'billing', label: 'Billing', disabled: true },
      ],
    },
  ];
  return (
    <div style={{ maxWidth: 240 }}>
      <SideNav sections={sections} activeId={active} aria-label="Main" />
    </div>
  );
}

export const Default: Story = { render: () => <Demo /> };
