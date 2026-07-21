import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../src/components/button/Button";
import {
  Menu,
  MenuItem,
  MenuSeparator,
} from "../src/components/menu/Menu";

function renderMenu(onSelect = vi.fn()) {
  render(
    <Menu trigger={<Button>Actions</Button>} aria-label="Actions">
      <MenuItem onSelect={onSelect}>Edit</MenuItem>
      <MenuItem>Copy</MenuItem>
      <MenuSeparator />
      <MenuItem disabled>Archive</MenuItem>
    </Menu>,
  );
  return { onSelect };
}

describe("Menu", () => {
  it("opens on trigger and focuses the first item", async () => {
    const user = userEvent.setup();
    renderMenu();
    const trigger = screen.getByRole("button", { name: "Actions" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menu", { name: "Actions" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus();
  });

  it("marks disabled items and moves focus with arrows", async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole("button", { name: "Actions" }));
    expect(screen.getByRole("menuitem", { name: "Archive" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Copy" })).toHaveFocus();
  });

  it("selects an item and closes", async () => {
    const user = userEvent.setup();
    const { onSelect } = renderMenu();
    await user.click(screen.getByRole("button", { name: "Actions" }));
    await user.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("supports a controlled open state", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <Menu
        open={false}
        onOpenChange={onOpenChange}
        trigger={<Button>Actions</Button>}
        aria-label="Actions"
      >
        <MenuItem>Edit</MenuItem>
      </Menu>,
    );
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Actions" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    // Still closed until the controlled prop updates.
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    rerender(
      <Menu
        open
        onOpenChange={onOpenChange}
        trigger={<Button>Actions</Button>}
        aria-label="Actions"
      >
        <MenuItem>Edit</MenuItem>
      </Menu>,
    );
    expect(screen.getByRole("menu", { name: "Actions" })).toBeInTheDocument();
  });
});
