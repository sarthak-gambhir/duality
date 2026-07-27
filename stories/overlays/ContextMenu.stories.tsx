import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ContextMenu, type ContextMenuItem } from "../../src";

const meta: Meta<typeof ContextMenu> = {
  title: "Overlays/ContextMenu",
  component: ContextMenu,
  parameters: {
    docsMinHeight: 420,
    docs: {
      description: {
        component:
          "Right-click menu opened at the cursor and clamped to the viewport. Pass `items` (each `{ label, onSelect, disabled? }`) and wrap the trigger region as children.",
      },
    },
  },
  argTypes: {
    items: { control: false, description: "Menu rows shown at the cursor." },
    "aria-label": {
      control: "text",
      description: "Accessible name for the menu.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

function Demo() {
  const [last, setLast] = useState("");
  const items: ContextMenuItem[] = [
    { id: "cut", label: "Cut", onSelect: () => setLast("Cut") },
    { id: "copy", label: "Copy", onSelect: () => setLast("Copy") },
    { id: "paste", label: "Paste", onSelect: () => setLast("Paste") },
    { id: "sep", separator: true },
    { id: "delete", label: "Delete", disabled: true },
  ];
  return (
    <div>
      <ContextMenu items={items} aria-label="Edit actions">
        <div
          style={{
            display: "grid",
            placeItems: "center",
            blockSize: 200,
            border: "var(--border-width) dashed var(--fg)",
            fontFamily: "var(--font-sans)",
          }}
        >
          Right-click anywhere in this box
        </div>
      </ContextMenu>
      {last && <p>Last action: {last}</p>}
    </div>
  );
}

export const Default: Story = { render: () => <Demo /> };
