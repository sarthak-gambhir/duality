import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "../../src";

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
