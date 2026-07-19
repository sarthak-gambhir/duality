import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Badge } from "../src/components/badge/Badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("formats count within max", () => {
    render(<Badge count={42} max={99} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("overflows count above max", () => {
    render(<Badge count={128} max={99} />);
    expect(screen.getByText("99+")).toBeInTheDocument();
  });

  it("hides a zero count unless showZero is set", () => {
    const { container, rerender } = render(<Badge count={0} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<Badge count={0} showZero />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("calls onRemove when the remove control is pressed", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <Badge onRemove={onRemove}>
        Design
      </Badge>,
    );
    await user.click(screen.getByRole("button", { name: "Remove" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
