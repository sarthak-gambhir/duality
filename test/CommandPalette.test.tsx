import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  CommandPalette,
  type Command,
} from "../src/components/command_palette/CommandPalette";

function makeCommands(onSave = vi.fn(), onCopy = vi.fn()): Command[] {
  return [
    {
      id: "save",
      label: "Save",
      group: "File",
      keywords: ["write"],
      onSelect: onSave,
    },
    { id: "open", label: "Open file", group: "File", onSelect: vi.fn() },
    { id: "copy", label: "Copy", group: "Edit", onSelect: onCopy },
  ];
}

describe("CommandPalette", () => {
  it("renders a searchable dialog only when open", () => {
    const { rerender } = render(
      <CommandPalette
        isOpen={false}
        onClose={() => {}}
        commands={makeCommands()}
      />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(
      <CommandPalette isOpen onClose={() => {}} commands={makeCommands()} />,
    );
    expect(
      screen.getByRole("dialog", { name: "Command palette" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveFocus();
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("filters by label and keywords as the user types", async () => {
    const user = userEvent.setup();
    render(
      <CommandPalette isOpen onClose={() => {}} commands={makeCommands()} />,
    );

    await user.keyboard("write");
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent("Save");
  });

  it("runs the active command on Enter and closes", async () => {
    const onSave = vi.fn();
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <CommandPalette
        isOpen
        onClose={onClose}
        commands={makeCommands(onSave)}
      />,
    );

    await user.keyboard("{Enter}");
    expect(onSave).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("closes on Escape", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <CommandPalette isOpen onClose={onClose} commands={makeCommands()} />,
    );
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });
});
