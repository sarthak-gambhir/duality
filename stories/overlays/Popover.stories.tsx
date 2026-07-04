import type { Meta, StoryObj } from '@storybook/react';
import { Button, Popover, Stack, Text } from '../../src';

const meta: Meta<typeof Popover> = {
  title: 'Overlays/Popover',
  component: Popover,
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover trigger={<Button>Open popover</Button>}>
      <Stack gap={2}>
        <Text weight="bold">Popover title</Text>
        <Text size="sm">Anchored to the trigger; closes on outside click or Escape.</Text>
      </Stack>
    </Popover>
  ),
};
