import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Progress } from "../src/components/progress/Progress";

describe("Progress", () => {
  it("exposes the value via aria attributes", () => {
    render(<Progress value={40} aria-label="Upload" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("clamps aria-valuenow within max", () => {
    render(<Progress value={250} max={100} aria-label="Over" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
  });

  it("omits aria-valuenow when indeterminate", () => {
    render(<Progress indeterminate aria-label="Loading" />);
    expect(screen.getByRole("progressbar")).not.toHaveAttribute(
      "aria-valuenow",
    );
  });

  it("shows a formatted value label", () => {
    render(
      <Progress
        value={3}
        max={5}
        showValue
        formatValue={(v, m) => `${v}/${m}`}
        aria-label="Steps"
      />,
    );
    expect(screen.getByText("3/5")).toBeInTheDocument();
  });
});
