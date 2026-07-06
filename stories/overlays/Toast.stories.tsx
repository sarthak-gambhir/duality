import type { Meta, StoryObj } from "@storybook/react";
import { Button, Inline, ToastProvider, useToast } from "../../src";

const meta: Meta = {
  title: "Overlays/Toast",
  parameters: { docsMinHeight: 320 },
};

export default meta;
type Story = StoryObj;

function Triggers() {
  const { toast } = useToast();
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
