import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  Text,
  ToggleGroup,
  ToggleGroupItem,
  useDisclosure,
  type DrawerSide,
} from '../../src';

const meta: Meta<typeof Drawer> = {
  title: 'Overlays/Drawer',
  component: Drawer,
  parameters: { docsMinHeight: 480 },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

function Demo() {
  const { isOpen, open, close } = useDisclosure();
  const [side, setSide] = useState<DrawerSide>('end');
  return (
    <>
      <ToggleGroup
        type="single"
        value={side}
        onValueChange={(v) => setSide(v as DrawerSide)}
        label="Drawer side"
      >
        <ToggleGroupItem value="start">Start</ToggleGroupItem>
        <ToggleGroupItem value="end">End</ToggleGroupItem>
        <ToggleGroupItem value="top">Top</ToggleGroupItem>
        <ToggleGroupItem value="bottom">Bottom</ToggleGroupItem>
      </ToggleGroup>
      <div style={{ marginBlockStart: 'var(--space-3)' }}>
        <Button onClick={open}>Open drawer</Button>
      </div>
      <Drawer isOpen={isOpen} onClose={close} side={side} aria-labelledby="demo_drawer_title">
        <DrawerHeader>
          <Text id="demo_drawer_title" weight="bold" size="lg">
            Settings
          </Text>
        </DrawerHeader>
        <DrawerBody>
          <Text>
            An edge-anchored panel that traps focus, closes on Escape, and dims the page with a
            dither scrim.
          </Text>
        </DrawerBody>
        <DrawerFooter>
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button onClick={close}>Save</Button>
        </DrawerFooter>
      </Drawer>
    </>
  );
}

export const Default: Story = { render: () => <Demo /> };
