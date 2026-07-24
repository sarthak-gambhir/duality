import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { FormField } from "../src/components/form_field/FormField";
import { PinInput } from "../src/components/pin_input/PinInput";

function Harness({ onComplete }: { onComplete?: (v: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <PinInput
      length={4}
      value={value}
      onValueChange={setValue}
      onComplete={onComplete}
    />
  );
}

function cells(): HTMLInputElement[] {
  return screen.getAllByRole("textbox") as HTMLInputElement[];
}

describe("PinInput", () => {
  it("auto-advances as digits are typed and fires onComplete", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<Harness onComplete={onComplete} />);
    const inputs = cells();

    inputs[0]!.focus();
    await user.keyboard("1234");

    expect(inputs.map((i) => i.value).join("")).toBe("1234");
    expect(onComplete).toHaveBeenCalledWith("1234");
  });

  it("ignores non-numeric characters by default", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const inputs = cells();
    inputs[0]!.focus();
    await user.keyboard("12ab");
    expect(inputs.map((i) => i.value).join("")).toBe("12");
  });

  it("steps back and clears on Backspace", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const inputs = cells();
    inputs[0]!.focus();
    await user.keyboard("12");
    await user.keyboard("{Backspace}{Backspace}");
    expect(inputs.map((i) => i.value).join("")).toBe("");
  });

  it("distributes a pasted value across cells", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const inputs = cells();
    inputs[0]!.focus();
    await user.paste("5678");
    expect(inputs.map((i) => i.value).join("")).toBe("5678");
  });
});

describe("PinInput disabled tooltip", () => {
  it("shows the entered value in a hover tooltip when disabled", async () => {
    const user = userEvent.setup();
    const { container } = render(<PinInput defaultValue="1234" disabled />);
    const root = container.querySelector(".du_disabled_tooltip");
    expect(root).not.toBeNull();
    await user.hover(root!);
    const tip = await screen.findByRole("tooltip");
    expect(tip).toHaveTextContent("Value: 1234");
  });

  it("omits the value line when masked, showing only the reason", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <PinInput
        defaultValue="1234"
        mask
        disabled
        disabledReason="Verified earlier"
      />,
    );
    await user.hover(container.querySelector(".du_disabled_tooltip")!);
    const tip = await screen.findByRole("tooltip");
    expect(tip).toHaveTextContent("Disabled due to: Verified earlier");
    expect(tip).not.toHaveTextContent("Value:");
  });

  it("does not wrap when enabled", () => {
    const { container } = render(<PinInput defaultValue="1234" />);
    expect(container.querySelector(".du_disabled_tooltip")).toBeNull();
  });

  it("receives disabled and reason from FormField context", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <FormField label="Code" disabled disabledReason="Locked by admin">
        <PinInput defaultValue="1234" />
      </FormField>,
    );
    await user.hover(container.querySelector(".du_disabled_tooltip")!);
    const tip = await screen.findByRole("tooltip");
    expect(tip).toHaveTextContent("Disabled due to: Locked by admin");
    expect(tip).toHaveTextContent("Value: 1234");
  });
});
