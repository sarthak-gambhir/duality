import type { Meta, StoryObj } from "@storybook/react";
import { Button, Tooltip } from "../../src";

const meta: Meta<typeof Tooltip> = {
  title: "Overlays/Tooltip",
  component: Tooltip,
  parameters: { docsMinHeight: 160 },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Placements: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "var(--space-6)",
        padding: "var(--space-8)",
      }}
    >
      <Tooltip content="On top" placement="top">
        <Button variant="inverse">Top</Button>
      </Tooltip>
      <Tooltip content="On bottom" placement="bottom">
        <Button variant="inverse">Bottom</Button>
      </Tooltip>
      <Tooltip content="On the right" placement="right">
        <Button variant="inverse">Right</Button>
      </Tooltip>
    </div>
  ),
};
