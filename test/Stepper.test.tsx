import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Stepper, type StepperStep } from "../src/components/stepper/Stepper";

const steps: StepperStep[] = [
  { label: "Account" },
  { label: "Address" },
  { label: "Payment" },
];

describe("Stepper", () => {
  it("marks the active step with aria-current and sets statuses", () => {
    render(<Stepper steps={steps} activeStep={1} aria-label="Progress" />);
    const items = screen
      .getByRole("list", { name: "Progress" })
      .querySelectorAll("li");
    expect(items[0]).toHaveAttribute("data-status", "complete");
    expect(items[1]).toHaveAttribute("data-status", "current");
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(items[2]).toHaveAttribute("data-status", "upcoming");
  });

  it("only makes completed/current steps clickable when interactive", async () => {
    const onStepChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Stepper steps={steps} activeStep={1} onStepChange={onStepChange} />,
    );

    // Upcoming step is not a button.
    expect(
      screen.queryByRole("button", { name: /Payment/ }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Account/ }));
    expect(onStepChange).toHaveBeenCalledWith(0);
  });
});
