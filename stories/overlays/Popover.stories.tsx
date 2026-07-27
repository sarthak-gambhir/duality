import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Button,
  Popover,
  Stack,
  Text,
  type PopoverPlacement,
} from "../../src";

const meta: Meta<typeof Popover> = {
  title: "Overlays/Popover",
  component: Popover,
  parameters: {
    docsMinHeight: 220,
    docs: {
      description: {
        component:
          "Click-triggered anchored panel, dismissed on outside press or Escape. Rendered in a portal and positioned with collision-aware flip/shift.",
      },
    },
  },
  argTypes: {
    placement: {
      control: false,
      description: "Anchor position.",
      table: { defaultValue: { summary: "bottom-start" } },
    },
    offset: { control: "number", description: "Gap between trigger and panel, in px." },
    flip: {
      control: "boolean",
      description: "Flip to the opposite side on overflow.",
    },
    shift: {
      control: "boolean",
      description: "Slide along the cross axis to stay in view.",
    },
    arrow: {
      control: "boolean",
      description: "Show a pointer arrow toward the trigger.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

const Panel = () => (
  <Stack gap={2}>
    <Text weight="bold">Popover title</Text>
    <Text size="sm">
      Anchored to the trigger; closes on outside click or Escape.
    </Text>
  </Stack>
);

export const Default: Story = {
  render: () => (
    <Popover trigger={<Button>Open popover</Button>}>
      <Panel />
    </Popover>
  ),
};

export const Placements: Story = {
  render: () => {
    const placements: PopoverPlacement[] = [
      "top-start",
      "top",
      "top-end",
      "bottom-start",
      "bottom",
      "bottom-end",
      "left",
      "right",
    ];
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-4)",
          padding: "var(--space-7)",
        }}
      >
        {placements.map((placement) => (
          <Popover
            key={placement}
            placement={placement}
            trigger={<Button variant="inverse">{placement}</Button>}
          >
            <Text size="sm">Placement: {placement}</Text>
          </Popover>
        ))}
      </div>
    );
  },
};

export const WithArrow: Story = {
  render: () => (
    <Popover arrow trigger={<Button>With arrow</Button>}>
      <Panel />
    </Popover>
  ),
};

export const FlipNearEdge: Story = {
  parameters: { docsMinHeight: 160 },
  render: () => (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <Popover
        placement="bottom-end"
        arrow
        trigger={<Button>Anchored near the edge</Button>}
      >
        <Text size="sm">
          Shifts and flips to stay within the viewport when there is no room.
        </Text>
      </Popover>
    </div>
  ),
};

function ControlledDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Stack gap={3}>
      <Button
        variant="ghost"
        // Keep this external control's press from counting as an outside-press
        // dismissal, otherwise mousedown would close the popover and the click
        // would immediately re-open it.
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => setOpen((o) => !o)}
      >
        External toggle ({open ? "open" : "closed"})
      </Button>
      <Popover
        open={open}
        onOpenChange={setOpen}
        trigger={<Button>Controlled trigger</Button>}
      >
        <Panel />
      </Popover>
    </Stack>
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
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger={<Button>Controlled trigger</Button>}
    >
      <p>Popover content</p>
    </Popover>
  );
}`,
      },
    },
  },
};
