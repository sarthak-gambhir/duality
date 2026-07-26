import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  RiFileAddLine,
  RiFolderOpenLine,
  RiSaveLine,
  RiScissorsLine,
  RiFileCopyLine,
  RiClipboardLine,
  RiContrastLine,
} from "react-icons/ri";
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
  const [inverted, setInverted] = useState(false);

  const commands: Command[] = [
    {
      id: "new",
      label: "New file",
      group: "File",
      keywords: ["create"],
      icon: RiFileAddLine,
      description: "Create an empty file",
      shortcut: ["Ctrl", "N"],
      onSelect: () => setLast("New file"),
    },
    {
      id: "open",
      label: "Open file",
      group: "File",
      icon: RiFolderOpenLine,
      shortcut: ["Ctrl", "O"],
      onSelect: () => setLast("Open file"),
    },
    {
      id: "save",
      label: "Save",
      group: "File",
      keywords: ["write"],
      icon: RiSaveLine,
      shortcut: ["Ctrl", "S"],
      onSelect: () => setLast("Save"),
    },
    {
      id: "cut",
      label: "Cut",
      group: "Edit",
      icon: RiScissorsLine,
      shortcut: ["Ctrl", "X"],
      onSelect: () => setLast("Cut"),
    },
    {
      id: "copy",
      label: "Copy",
      group: "Edit",
      icon: RiFileCopyLine,
      shortcut: ["Ctrl", "C"],
      onSelect: () => setLast("Copy"),
    },
    {
      id: "paste",
      label: "Paste",
      group: "Edit",
      icon: RiClipboardLine,
      disabled: true,
      onSelect: () => setLast("Paste"),
    },
    {
      id: "theme",
      label: "Toggle theme",
      group: "View",
      keywords: ["dark", "invert"],
      icon: RiContrastLine,
      description: "Invert the preview colors",
      onSelect: () => {
        setInverted((prev) => !prev);
        setLast("Toggle theme");
      },
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
      <div
        style={{
          marginBlockStart: "var(--space-3)",
          padding: "var(--space-3)",
          border: "var(--border-width) solid var(--fg)",
          color: inverted ? "var(--bg)" : "var(--fg)",
          backgroundColor: inverted ? "var(--fg)" : "var(--bg)",
        }}
      >
        Preview ({inverted ? "inverted" : "normal"}) - run &ldquo;Toggle
        theme&rdquo; to flip.
      </div>
      <CommandPalette
        isOpen={isOpen}
        onClose={close}
        commands={commands}
        recentIds={["save", "theme"]}
      />
    </>
  );
}

export const Default: Story = {
  render: () => <Demo />,
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const { isOpen, open, close } = useDisclosure();

  const commands: Command[] = [
    { id: "new", label: "New file", group: "File", icon: RiFileAddLine, shortcut: ["Ctrl", "N"], onSelect: () => {} },
    { id: "open", label: "Open file", group: "File", icon: RiFolderOpenLine, shortcut: ["Ctrl", "O"], onSelect: () => {} },
    { id: "save", label: "Save", group: "File", icon: RiSaveLine, shortcut: ["Ctrl", "S"], onSelect: () => {} },
    { id: "paste", label: "Paste", group: "Edit", icon: RiClipboardLine, disabled: true, onSelect: () => {} },
  ];

  return (
    <>
      <Button onClick={open}>Open command palette</Button>
      <CommandPalette
        isOpen={isOpen}
        onClose={close}
        commands={commands}
        recentIds={["save"]}
      />
    </>
  );
}`,
      },
    },
  },
};
