import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Alert, Button } from "../../src";

const meta: Meta<typeof Alert> = {
  title: "Display/Alert",
  component: Alert,
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Tones: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--space-3)", maxWidth: 420 }}>
      <Alert tone="info" title="Info">
        A neutral message. Marker is a filled square with a solid border.
      </Alert>
      <Alert tone="warning" title="Warning">
        Something needs attention. Marker is hollow with a dashed border.
      </Alert>
      <Alert tone="error" title="Error">
        Something went wrong. Marker is a diamond with a double border.
      </Alert>
    </div>
  ),
};

export const Dismissible: Story = {
  render: function DismissibleStory() {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ maxWidth: 420 }}>
        {open ? (
          <Alert tone="info" title="Heads up" onDismiss={() => setOpen(false)}>
            This alert can be dismissed with the close button.
          </Alert>
        ) : (
          <Button size="sm" onClick={() => setOpen(true)}>
            Restore alert
          </Button>
        )}
      </div>
    );
  },
};

export const WithAction: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Alert
        tone="warning"
        title="Update available"
        action={<Button size="sm">Update</Button>}
        onDismiss={() => {}}
      >
        A new version is ready to install.
      </Alert>
    </div>
  ),
};

export const CustomIcon: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <Alert tone="info" title="Saved" icon={<span>✓</span>}>
        Your changes were saved. This uses a custom marker.
      </Alert>
    </div>
  ),
};
