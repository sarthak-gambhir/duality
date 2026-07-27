import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button, Menu, MenuItem, MenuSeparator, Text } from "../../src";

const meta: Meta<typeof Menu> = {
  title: "Overlays/Menu",
  component: Menu,
  parameters: {
    docsMinHeight: 240,
    docs: {
      description: {
        component:
          "Dropdown menu with a button trigger and a keyboard-navigable list of `MenuItem`s. Rendered in a portal with collision-aware placement; controlled or uncontrolled open state.",
      },
    },
  },
  argTypes: {
    placement: {
      control: false,
      description: "Anchor position.",
      table: { defaultValue: { summary: "bottom-start" } },
    },
    offset: { control: "number", description: "Gap between trigger and menu, in px." },
    flip: {
      control: "boolean",
      description: "Flip to the opposite side on overflow.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Menu>;

const Items = ({ onAction }: { onAction: (label: string) => void }) => (
  <>
    <MenuItem onSelect={() => onAction("Edit")}>Edit</MenuItem>
    <MenuItem onSelect={() => onAction("Duplicate")}>Duplicate</MenuItem>
    <MenuSeparator />
    <MenuItem disabled>Archive (disabled)</MenuItem>
    <MenuItem onSelect={() => onAction("Delete")}>Delete</MenuItem>
  </>
);

function ActionReadout({ action }: { action: string | null }) {
  return <Text size="sm">Last action: {action ?? "none"}</Text>;
}

function DefaultDemo() {
  const [action, setAction] = useState<string | null>(null);
  return (
    <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
      <Menu trigger={<Button>Actions</Button>} aria-label="Actions">
        <Items onAction={setAction} />
      </Menu>
      <ActionReadout action={action} />
    </div>
  );
}

export const Default: Story = { render: () => <DefaultDemo /> };

function PlacementDemo() {
  const [action, setAction] = useState<string | null>(null);
  return (
    <div
      style={{
        display: "flex",
        gap: "var(--space-3)",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <ActionReadout action={action} />
      <Menu
        placement="bottom-end"
        trigger={<Button>Aligned to end</Button>}
        aria-label="Actions"
      >
        <Items onAction={setAction} />
      </Menu>
    </div>
  );
}

export const Placement: Story = { render: () => <PlacementDemo /> };

function ControlledDemo() {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<string | null>(null);
  return (
    <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
      <Button
        variant="ghost"
        // Keep this external control's press from counting as an outside-press
        // dismissal, otherwise mousedown would close the menu and the click
        // would immediately re-open it.
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => setOpen((o) => !o)}
      >
        Toggle ({open ? "open" : "closed"})
      </Button>
      <Menu
        open={open}
        onOpenChange={setOpen}
        trigger={<Button>Actions</Button>}
        aria-label="Actions"
      >
        <Items onAction={setAction} />
      </Menu>
      <Text size="sm">
        open is controlled; both the trigger and external button update it.
      </Text>
      <ActionReadout action={action} />
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
    <Menu
      open={open}
      onOpenChange={setOpen}
      trigger={<Button>Actions</Button>}
      aria-label="Actions"
    >
      <MenuItem onSelect={() => {}}>Edit</MenuItem>
      <MenuItem onSelect={() => {}}>Duplicate</MenuItem>
    </Menu>
  );
}`,
      },
    },
  },
};
