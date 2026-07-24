import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NumberInput } from "../src/components/number_input/NumberInput";

describe("NumberInput", () => {
  it("exposes a spinbutton and steps with the buttons", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <NumberInput
        aria-label="qty"
        defaultValue={3}
        min={0}
        max={5}
        onValueChange={onValueChange}
      />,
    );

    const field = screen.getByRole("spinbutton", { name: "qty" });
    expect(field).toHaveValue("3");

    await user.click(screen.getByRole("button", { name: "Increase" }));
    expect(onValueChange).toHaveBeenLastCalledWith(4);
  });

  it("clamps to max and disables the increase button at the ceiling", async () => {
    const user = userEvent.setup();
    render(<NumberInput aria-label="qty" defaultValue={5} min={0} max={5} />);

    const increase = screen.getByRole("button", { name: "Increase" });
    expect(increase).toBeDisabled();

    const field = screen.getByRole("spinbutton", { name: "qty" });
    field.focus();
    await user.keyboard("{ArrowUp}");
    expect(field).toHaveValue("5");
  });

  it("steps with arrow keys", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <NumberInput
        aria-label="qty"
        defaultValue={2}
        onValueChange={onValueChange}
      />,
    );
    const field = screen.getByRole("spinbutton", { name: "qty" });
    field.focus();
    await user.keyboard("{ArrowDown}");
    expect(onValueChange).toHaveBeenLastCalledWith(1);
  });

  it("is disabled", () => {
    render(<NumberInput aria-label="qty" defaultValue={1} disabled />);
    expect(screen.getByRole("spinbutton", { name: "qty" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Increase" })).toBeDisabled();
  });

  it("takes a large step with PageUp/PageDown", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <NumberInput
        aria-label="qty"
        defaultValue={10}
        min={0}
        max={100}
        step={1}
        largeStep={10}
        onValueChange={onValueChange}
      />,
    );
    const field = screen.getByRole("spinbutton", { name: "qty" });
    field.focus();
    await user.keyboard("{PageUp}");
    expect(onValueChange).toHaveBeenLastCalledWith(20);
    await user.keyboard("{PageDown}");
    expect(onValueChange).toHaveBeenLastCalledWith(10);
  });

  it("hides the stepper buttons when hideSteppers is set", () => {
    render(<NumberInput aria-label="qty" defaultValue={1} hideSteppers />);
    expect(
      screen.queryByRole("button", { name: "Increase" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("spinbutton", { name: "qty" })).toBeInTheDocument();
  });

  it("renders prefix and suffix slots", () => {
    render(
      <NumberInput aria-label="price" defaultValue={5} prefix="$" suffix="USD" />,
    );
    expect(screen.getByText("$")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
  });
});

describe("NumberInput disabled tooltip", () => {
  it("shows the value in a hover tooltip when disabled", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <NumberInput aria-label="qty" defaultValue={5} disabled />,
    );
    const root = container.querySelector(".du_disabled_tooltip");
    expect(root).not.toBeNull();
    await user.hover(root!);
    const tip = await screen.findByRole("tooltip");
    expect(tip).toHaveTextContent("Value: 5");
  });

  it("shows the reason when disabled", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <NumberInput
        aria-label="qty"
        defaultValue={5}
        disabled
        disabledReason="Set by your plan"
      />,
    );
    await user.hover(container.querySelector(".du_disabled_tooltip")!);
    const tip = await screen.findByRole("tooltip");
    expect(tip).toHaveTextContent("Disabled due to: Set by your plan");
  });

  it("does not wrap when enabled", () => {
    const { container } = render(
      <NumberInput aria-label="qty" defaultValue={5} />,
    );
    expect(container.querySelector(".du_disabled_tooltip")).toBeNull();
  });
});
