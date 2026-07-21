import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Button,
  Inline,
  ToastProvider,
  useToast,
  type ToastPlacement,
} from "../../src";

const meta: Meta = {
  title: "Overlays/Toast",
  parameters: { docsMinHeight: 320 },
};

export default meta;
type Story = StoryObj;

function Triggers() {
  const { toast, dismissAll } = useToast();
  return (
    <Inline gap={2}>
      <Button
        onClick={() =>
          toast({
            tone: "info",
            title: "Saved",
            description: "Your changes were saved.",
          })
        }
      >
        Info
      </Button>
      <Button
        variant="inverse"
        onClick={() =>
          toast({
            tone: "success",
            title: "Done",
            description: "The task completed successfully.",
          })
        }
      >
        Success
      </Button>
      <Button
        variant="inverse"
        onClick={() =>
          toast({
            tone: "warning",
            title: "Heads up",
            description: "Check your input.",
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="inverse"
        onClick={() =>
          toast({
            tone: "error",
            title: "Failed",
            description: "Something went wrong.",
          })
        }
      >
        Error
      </Button>
      <Button variant="ghost" onClick={dismissAll}>
        Dismiss all
      </Button>
    </Inline>
  );
}

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <Triggers />
    </ToastProvider>
  ),
};

function ActionTriggers() {
  const { toast } = useToast();
  const [undone, setUndone] = useState(false);
  return (
    <Inline gap={2}>
      <Button
        onClick={() =>
          toast({
            tone: "info",
            title: "Item deleted",
            description: "You can still undo this.",
            duration: 0,
            action: { label: "Undo", onClick: () => setUndone(true) },
          })
        }
      >
        Delete with undo
      </Button>
      {undone && <span>Undone!</span>}
    </Inline>
  );
}

export const WithAction: Story = {
  render: () => (
    <ToastProvider placement="bottom-start">
      <ActionTriggers />
    </ToastProvider>
  ),
};

function PlacementDemo() {
  const { toast } = useToast();
  return (
    <Button
      onClick={() =>
        toast({ tone: "info", title: "Hi", description: "From this corner." })
      }
    >
      Show toast
    </Button>
  );
}

export const Placements: Story = {
  render: () => {
    const placements: ToastPlacement[] = [
      "top-start",
      "top-center",
      "top-end",
      "bottom-start",
      "bottom-center",
      "bottom-end",
    ];
    return (
      <Inline gap={2}>
        {placements.map((placement) => (
          <ToastProvider key={placement} placement={placement}>
            <div style={{ display: "grid" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 12 }}>
                {placement}
              </span>
              <PlacementDemo />
            </div>
          </ToastProvider>
        ))}
      </Inline>
    );
  },
};

function QueueTriggers() {
  const { toast } = useToast();
  return (
    <Button
      onClick={() =>
        toast({ tone: "info", title: `Toast ${Date.now() % 1000}` })
      }
    >
      Add toast (max 3 visible)
    </Button>
  );
}

export const MaxVisible: Story = {
  render: () => (
    <ToastProvider max={3}>
      <QueueTriggers />
    </ToastProvider>
  ),
};

export const Persistent: Story = {
  render: () => {
    function PersistentTrigger() {
      const { toast } = useToast();
      return (
        <Button
          onClick={() =>
            toast({
              tone: "warning",
              title: "Stays until dismissed",
              description: "duration: 0 disables auto-dismiss.",
              duration: 0,
            })
          }
        >
          Show persistent toast
        </Button>
      );
    }
    return (
      <ToastProvider>
        <PersistentTrigger />
      </ToastProvider>
    );
  },
};
