import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ConfirmDialog } from "../src/components/confirm_dialog/ConfirmDialog";

describe("ConfirmDialog", () => {
  it("calls onConfirm when the confirm button is pressed", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <ConfirmDialog
        isOpen
        title="Delete?"
        description="This cannot be undone."
        confirmLabel="Delete"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("calls onCancel when the cancel button is pressed", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <ConfirmDialog
        isOpen
        title="Delete?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("calls onCancel on Escape", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(
      <ConfirmDialog
        isOpen
        title="Delete?"
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />,
    );

    await user.keyboard("{Escape}");
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("is not rendered when closed", () => {
    render(
      <ConfirmDialog
        isOpen={false}
        title="Delete?"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("uses the alertdialog role for the danger tone", () => {
    render(
      <ConfirmDialog
        isOpen
        tone="danger"
        title="Delete?"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });

  it("disables the buttons while an async confirm is pending", async () => {
    const user = userEvent.setup();
    let resolve!: () => void;
    const pending = new Promise<void>((r) => {
      resolve = r;
    });
    render(
      <ConfirmDialog
        isOpen
        title="Save?"
        confirmLabel="Save"
        onConfirm={() => pending}
        onCancel={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Save/ }));
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();

    resolve();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Cancel" })).not.toBeDisabled(),
    );
  });
});
