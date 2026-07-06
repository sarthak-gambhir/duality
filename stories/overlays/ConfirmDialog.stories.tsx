import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, ConfirmDialog } from '../../src';

const meta: Meta<typeof ConfirmDialog> = {
  title: 'Overlays/ConfirmDialog',
  component: ConfirmDialog,
  parameters: { docsMinHeight: 360 },
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

function Demo({ tone }: { tone?: 'default' | 'danger' }) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState('');
  return (
    <>
      <Button variant={tone === 'danger' ? 'inverse' : 'solid'} onClick={() => setOpen(true)}>
        {tone === 'danger' ? 'Delete project' : 'Publish'}
      </Button>
      {result && <p>Last action: {result}</p>}
      <ConfirmDialog
        isOpen={open}
        tone={tone}
        title={tone === 'danger' ? 'Delete project?' : 'Publish changes?'}
        description={
          tone === 'danger'
            ? 'This permanently removes the project and all of its data. This cannot be undone.'
            : 'Your changes will be visible to everyone right away.'
        }
        confirmLabel={tone === 'danger' ? 'Delete' : 'Publish'}
        onConfirm={() => {
          setResult('confirmed');
          setOpen(false);
        }}
        onCancel={() => {
          setResult('cancelled');
          setOpen(false);
        }}
      />
    </>
  );
}

export const Default: Story = { render: () => <Demo /> };
export const Danger: Story = { render: () => <Demo tone="danger" /> };
