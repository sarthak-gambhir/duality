import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PinInput } from '../../src';

const meta: Meta<typeof PinInput> = {
  title: 'Controls/PinInput',
  component: PinInput,
};

export default meta;
type Story = StoryObj<typeof PinInput>;

function Demo(props: { length?: number; mask?: boolean; type?: 'numeric' | 'alphanumeric' }) {
  const [value, setValue] = useState('');
  return (
    <div>
      <PinInput {...props} value={value} onValueChange={setValue} />
      <p style={{ fontFamily: 'var(--font-mono)' }}>Value: {value || '(empty)'}</p>
    </div>
  );
}

export const Default: Story = { render: () => <Demo /> };
export const SixDigits: Story = { render: () => <Demo length={6} /> };
export const Masked: Story = { render: () => <Demo mask /> };
export const Alphanumeric: Story = { render: () => <Demo type="alphanumeric" /> };
