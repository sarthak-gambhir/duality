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
      <NumberInput aria-label="qty" defaultValue={2} onValueChange={onValueChange} />,
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
});
