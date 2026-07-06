import type { Meta, StoryObj } from '@storybook/react';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text,
  useDisclosure,
} from '../../src';

const meta: Meta<typeof Modal> = {
  title: 'Overlays/Modal',
  component: Modal,
  parameters: { docsMinHeight: 480 },
};

export default meta;
type Story = StoryObj<typeof Modal>;

function Demo() {
  const { isOpen, open, close } = useDisclosure();
  return (
    <>
      <Button onClick={open}>Open modal</Button>
      <Modal isOpen={isOpen} onClose={close} aria-labelledby="demo_modal_title">
        <ModalHeader>
          <Text id="demo_modal_title" weight="bold" size="lg">
            Confirm action
          </Text>
        </ModalHeader>
        <ModalBody>
          <Text>This dialog traps focus, closes on Escape, and dims with a dither scrim.</Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button onClick={close}>Confirm</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export const Default: Story = { render: () => <Demo /> };
