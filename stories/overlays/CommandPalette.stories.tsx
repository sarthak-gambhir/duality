import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Button,
  CommandPalette,
  Text,
  useDisclosure,
  type Command,
} from "../../src";

const meta: Meta<typeof CommandPalette> = {
  title: "Overlays/CommandPalette",
  component: CommandPalette,
  parameters: { docsMinHeight: 480 },
};

export default meta;
type Story = StoryObj<typeof CommandPalette>;

function Demo() {
  const { isOpen, open, close } = useDisclosure();
  const [last, setLast] = useState<string>("");

  const commands: Command[] = [
    {
      id: "new",
      label: "New file",
      group: "File",
      keywords: ["create"],
      onSelect: () => setLast("New file"),
    },
    {
      id: "open",
      label: "Open file",
      group: "File",
      onSelect: () => setLast("Open file"),
    },
    {
      id: "save",
      label: "Save",
      group: "File",
      keywords: ["write"],
      onSelect: () => setLast("Save"),
    },
    { id: "cut", label: "Cut", group: "Edit", onSelect: () => setLast("Cut") },
    {
      id: "copy",
      label: "Copy",
      group: "Edit",
      onSelect: () => setLast("Copy"),
    },
    {
      id: "paste",
      label: "Paste",
      group: "Edit",
      disabled: true,
      onSelect: () => setLast("Paste"),
    },
    {
      id: "theme",
      label: "Toggle theme",
      group: "View",
      keywords: ["dark", "invert"],
      onSelect: () => setLast("Toggle theme"),
    },
  ];

  return (
    <>
      <Button onClick={open}>Open command palette</Button>
      {last && (
        <Text style={{ display: "block", marginBlockStart: "var(--space-3)" }}>
          Ran: {last}
        </Text>
      )}
      <CommandPalette isOpen={isOpen} onClose={close} commands={commands} />
    </>
  );
}

export const Default: Story = { render: () => <Demo /> };
