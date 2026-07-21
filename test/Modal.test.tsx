import { useRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Modal, ModalBody } from "../src/components/modal/Modal";

describe("Modal", () => {
  it("renders a dialog only when open", () => {
    const { rerender } = render(
      <Modal isOpen={false} onClose={() => {}} aria-label="Demo">
        <ModalBody>Body</ModalBody>
      </Modal>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(
      <Modal isOpen onClose={() => {}} aria-label="Demo">
        <ModalBody>Body</ModalBody>
      </Modal>,
    );
    const dialog = screen.getByRole("dialog", { name: "Demo" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("closes on Escape", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal isOpen onClose={onClose} aria-label="Demo">
        <ModalBody>
          <button>Inside</button>
        </ModalBody>
      </Modal>,
    );
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("closes on backdrop press", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} aria-label="Demo">
        <ModalBody>Body</ModalBody>
      </Modal>,
    );
    fireEvent.mouseDown(document.body);
    expect(onClose).toHaveBeenCalled();
  });

  it("applies the size preset class", () => {
    render(
      <Modal isOpen onClose={() => {}} size="lg" aria-label="Demo">
        <ModalBody>Body</ModalBody>
      </Modal>,
    );
    expect(screen.getByRole("dialog")).toHaveClass("du_modal_size_lg");
  });

  it("renders a close button that calls onClose", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal isOpen onClose={onClose} showCloseButton aria-label="Demo">
        <ModalBody>Body</ModalBody>
      </Modal>,
    );
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("does not dismiss when isDismissable is false", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal isOpen onClose={onClose} isDismissable={false} aria-label="Demo">
        <ModalBody>Body</ModalBody>
      </Modal>,
    );
    await user.keyboard("{Escape}");
    fireEvent.mouseDown(document.body);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("honors initialFocusRef", () => {
    function Demo() {
      const ref = useRef<HTMLButtonElement>(null);
      return (
        <Modal isOpen onClose={() => {}} initialFocusRef={ref} aria-label="Demo">
          <ModalBody>
            <button>First</button>
            <button ref={ref}>Second</button>
          </ModalBody>
        </Modal>
      );
    }
    render(<Demo />);
    expect(screen.getByRole("button", { name: "Second" })).toHaveFocus();
  });
});
