import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button, Tooltip } from "../../src";

const meta: Meta<typeof Tooltip> = {
  title: "Overlays/Tooltip",
  component: Tooltip,
  parameters: { docsMinHeight: 160 },
  argTypes: {
    content: { control: "text", description: "Tooltip contents." },
    placement: {
      control: "inline-radio",
      options: ["top", "bottom", "left", "right"],
      description: "Preferred side to render on.",
      table: { defaultValue: { summary: "top" } },
    },
    arrow: {
      control: "boolean",
      description: "Render a pointer arrow toward the trigger.",
    },
    offset: {
      control: "number",
      description: "Gap in pixels between the trigger and the tooltip.",
    },
    openDelay: {
      control: "number",
      description: "Delay in ms before opening on hover/focus.",
    },
    closeDelay: {
      control: "number",
      description: "Delay in ms before closing after leaving.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
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
      <Tooltip content="On the left" placement="left">
        <Button variant="inverse">Left</Button>
      </Tooltip>
      <Tooltip content="On the right" placement="right">
        <Button variant="inverse">Right</Button>
      </Tooltip>
    </div>
  ),
};

export const WithArrow: Story = {
  render: () => (
    <div style={{ padding: "var(--space-7)" }}>
      <Tooltip content="Now with a pointer" placement="top" arrow>
        <Button variant="inverse">Hover me</Button>
      </Tooltip>
    </div>
  ),
};

export const Delays: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "var(--space-6)",
        padding: "var(--space-7)",
      }}
    >
      <Tooltip content="Opens instantly" openDelay={0}>
        <Button variant="inverse">No open delay</Button>
      </Tooltip>
      <Tooltip content="Lingers on exit" closeDelay={600} arrow>
        <Button variant="inverse">Close delay 600ms</Button>
      </Tooltip>
    </div>
  ),
};

function ControlledDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ padding: "var(--space-7)" }}>
      <Tooltip
        content="Toggled by click, not hover"
        placement="right"
        open={open}
        arrow
      >
        <Button variant="inverse" onClick={() => setOpen((prev) => !prev)}>
          {open ? "Hide" : "Show"} tip
        </Button>
      </Tooltip>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [open, setOpen] = useState(false);
  return (
    <Tooltip content="Toggled by click, not hover" placement="right" open={open} arrow>
      <Button variant="inverse" onClick={() => setOpen((prev) => !prev)}>
        {open ? "Hide" : "Show"} tip
      </Button>
    </Tooltip>
  );
}`,
      },
    },
  },
};
