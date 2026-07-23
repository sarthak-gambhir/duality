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

  it("applies explicit error/warning status overrides", () => {
    render(
      <Stepper
        aria-label="Progress"
        activeStep={2}
        steps={[
          { label: "Select" },
          { label: "Validate", status: "error" },
          { label: "Upload", status: "warning" },
        ]}
      />,
    );
    const items = screen
      .getByRole("list", { name: "Progress" })
      .querySelectorAll("li");
    expect(items[1]).toHaveAttribute("data-status", "error");
    expect(items[2]).toHaveAttribute("data-status", "warning");
  });

  it("renders an Optional caption", () => {
    render(
      <Stepper
        aria-label="Progress"
        activeStep={0}
        steps={[{ label: "Email" }, { label: "Photo", optional: true }]}
      />,
    );
    expect(screen.getByText("Optional")).toBeInTheDocument();
  });

  it("makes upcoming steps clickable when allowAllSteps is set", async () => {
    const onStepChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Stepper
        steps={steps}
        activeStep={0}
        onStepChange={onStepChange}
        allowAllSteps
      />,
    );

    await user.click(screen.getByRole("button", { name: /Payment/ }));
    expect(onStepChange).toHaveBeenCalledWith(2);
  });
});
