import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from '../../src';

const meta: Meta<typeof Slider> = {
  title: 'Controls/Slider',
  component: Slider,
};

export default meta;
type Story = StoryObj<typeof Slider>;

function Demo() {
  const [value, setValue] = useState(40);
  return (
    <Slider
      min={0}
      max={100}
      value={value}
      aria-label="volume"
      onChange={(e) => setValue(Number(e.target.value))}
    />
  );
}

export const Default: Story = { render: () => <Demo /> };
export const Disabled: Story = {
  render: () => <Slider defaultValue={30} disabled aria-label="disabled" />,
};
