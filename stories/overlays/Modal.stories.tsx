import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Text,
  useDisclosure,
  type ModalSize,
} from "../../src";

const meta: Meta<typeof Modal> = {
  title: "Overlays/Modal",
  component: Modal,
  parameters: { docsMinHeight: 480 },
};

export default meta;
type Story = StoryObj<typeof Modal>;

function Demo() {
  const { isOpen, open, close } = useDisclosure();
  const [result, setResult] = useState<string | null>(null);
  return (
    <>
      <Button onClick={open}>Open modal</Button>
      {result && <p style={{ marginBlockStart: "var(--space-2)" }}>{result}</p>}
      <Modal isOpen={isOpen} onClose={close} aria-labelledby="demo_modal_title">
        <ModalHeader>
          <Text id="demo_modal_title" weight="bold" size="lg">
            Example dialog
          </Text>
        </ModalHeader>
        <ModalBody>
          <Text>
            This dialog traps focus, closes on Escape, and dims with a dither
            scrim.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            onClick={() => {
              setResult("Cancelled");
              close();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setResult("Confirmed");
              close();
            }}
          >
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export const Default: Story = { render: () => <Demo /> };

function SizeDemo({ size }: { size: ModalSize }) {
  const { isOpen, open, close } = useDisclosure();
  return (
    <>
      <Button onClick={open}>Open {size}</Button>
      <Modal
        isOpen={isOpen}
        onClose={close}
        size={size}
        showCloseButton
        aria-labelledby={`size_${size}_title`}
      >
        <ModalHeader>
          <Text id={`size_${size}_title`} weight="bold" size="lg">
            Size: {size}
          </Text>
        </ModalHeader>
        <ModalBody>
          <Text>A dialog rendered at the {size} width preset.</Text>
        </ModalBody>
      </Modal>
    </>
  );
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
      {(["sm", "md", "lg", "xl", "full"] as ModalSize[]).map((size) => (
        <SizeDemo key={size} size={size} />
      ))}
    </div>
  ),
};

export const WithCloseButton: Story = {
  render: () => {
    function CloseDemo() {
      const { isOpen, open, close } = useDisclosure();
      return (
        <>
          <Button onClick={open}>Open</Button>
          <Modal
            isOpen={isOpen}
            onClose={close}
            showCloseButton
            aria-labelledby="close_demo_title"
          >
            <ModalHeader>
              <Text id="close_demo_title" weight="bold" size="lg">
                Corner close button
              </Text>
            </ModalHeader>
            <ModalBody>
              <Text>The X in the corner and Escape both close this.</Text>
            </ModalBody>
          </Modal>
        </>
      );
    }
    return <CloseDemo />;
  },
};

export const NonDismissable: Story = {
  render: () => {
    function BlockingDemo() {
      const { isOpen, open, close } = useDisclosure();
      return (
        <>
          <Button onClick={open}>Open blocking modal</Button>
          <Modal
            isOpen={isOpen}
            onClose={close}
            isDismissable={false}
            aria-labelledby="blocking_title"
          >
            <ModalHeader>
              <Text id="blocking_title" weight="bold" size="lg">
                Action required
              </Text>
            </ModalHeader>
            <ModalBody>
              <Text>
                Backdrop and Escape are disabled; you must use a button.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button onClick={close}>Acknowledge</Button>
            </ModalFooter>
          </Modal>
        </>
      );
    }
    return <BlockingDemo />;
  },
};

export const LongContent: Story = {
  render: () => {
    function ScrollDemo() {
      const { isOpen, open, close } = useDisclosure();
      return (
        <>
          <Button onClick={open}>Open long modal</Button>
          <Modal
            isOpen={isOpen}
            onClose={close}
            aria-labelledby="scroll_title"
          >
            <ModalHeader>
              <Text id="scroll_title" weight="bold" size="lg">
                Terms
              </Text>
              <ModalCloseButton />
            </ModalHeader>
            <ModalBody>
              {Array.from({ length: 30 }, (_, i) => (
                <Text key={i} style={{ display: "block" }}>
                  Paragraph {i + 1}. The body scrolls within the capped height.
                </Text>
              ))}
            </ModalBody>
            <ModalFooter>
              <Button onClick={close}>Done</Button>
            </ModalFooter>
          </Modal>
        </>
      );
    }
    return <ScrollDemo />;
  },
};
