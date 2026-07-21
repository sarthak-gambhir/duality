import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Drawer, DrawerBody } from "../src/components/drawer/Drawer";

describe("Drawer", () => {
  it("renders a dialog only when open", () => {
    const { rerender } = render(
      <Drawer isOpen={false} onClose={() => {}} aria-label="Settings">
        <DrawerBody>Body</DrawerBody>
      </Drawer>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(
      <Drawer isOpen onClose={() => {}} side="start" aria-label="Settings">
        <DrawerBody>Body</DrawerBody>
      </Drawer>,
    );
    const dialog = screen.getByRole("dialog", { name: "Settings" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveClass("du_drawer_start");
  });

  it("closes on Escape", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Drawer isOpen onClose={onClose} aria-label="Settings">
        <DrawerBody>
          <button>Inside</button>
        </DrawerBody>
      </Drawer>,
    );
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("closes on backdrop press", () => {
    const onClose = vi.fn();
    render(
      <Drawer isOpen onClose={onClose} aria-label="Settings">
        <DrawerBody>Body</DrawerBody>
      </Drawer>,
    );
    fireEvent.mouseDown(document.body);
    expect(onClose).toHaveBeenCalled();
  });

  it("maps a size preset to the panel dimension", () => {
    render(
      <Drawer isOpen onClose={() => {}} side="end" size="sm" aria-label="S">
        <DrawerBody>Body</DrawerBody>
      </Drawer>,
    );
    expect(screen.getByRole("dialog")).toHaveStyle({ inlineSize: "280px" });
  });

  it("renders a close button that calls onClose", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Drawer isOpen onClose={onClose} showCloseButton aria-label="Settings">
        <DrawerBody>Body</DrawerBody>
      </Drawer>,
    );
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalled();
  });
});
