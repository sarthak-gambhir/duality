import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Banner } from "../src/components/banner/Banner";

describe("Banner", () => {
  it("renders the title and body", () => {
    render(
      <Banner tone="info" title="Heads up">
        A new version is available.
      </Banner>,
    );
    expect(screen.getByText("Heads up")).toBeInTheDocument();
    expect(screen.getByText("A new version is available.")).toBeInTheDocument();
  });

  it("uses role alert for the error tone", () => {
    render(<Banner tone="error">Payment failed</Banner>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("calls onDismiss when the close button is pressed", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <Banner tone="info" onDismiss={onDismiss}>
        Dismiss me
      </Banner>,
    );
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("omits the close button when not dismissible", () => {
    render(<Banner tone="info">No close</Banner>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
