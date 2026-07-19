import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Alert } from "../src/components/alert/Alert";

describe("Alert", () => {
  it("renders the title and body", () => {
    render(
      <Alert tone="info" title="Heads up">
        Something happened.
      </Alert>,
    );
    expect(screen.getByText("Heads up")).toBeInTheDocument();
    expect(screen.getByText("Something happened.")).toBeInTheDocument();
  });

  it("uses role alert for the error tone", () => {
    render(<Alert tone="error">Boom</Alert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("calls onDismiss when the close button is pressed", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <Alert tone="info" onDismiss={onDismiss}>
        Dismiss me
      </Alert>,
    );
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("omits the close button when not dismissible", () => {
    render(<Alert tone="info">No close</Alert>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders the action slot", () => {
    render(
      <Alert tone="warning" action={<button>Update</button>}>
        Update available
      </Alert>,
    );
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
  });
});
