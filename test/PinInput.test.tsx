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

describe("PinInput disabled reason caption", () => {
  it("renders the reason caption and wires it via aria-describedby", () => {
    const { container } = render(
      <PinInput
        defaultValue="1234"
        disabled
        disabledReason="Verified earlier"
      />,
    );
    const caption = container.querySelector(".du_disabled_message");
    expect(caption).toHaveTextContent("Verified earlier");
    expect(screen.getByRole("group").getAttribute("aria-describedby")).toBe(
      caption!.id,
    );
  });

  it("renders no caption when disabled without a reason", () => {
    const { container } = render(<PinInput defaultValue="1234" disabled />);
    expect(container.querySelector(".du_disabled_message")).toBeNull();
    expect(container.querySelector(".du_disabled_message_wrap")).toBeNull();
  });

  it("renders no caption when enabled", () => {
    const { container } = render(<PinInput defaultValue="1234" />);
    expect(container.querySelector(".du_disabled_message")).toBeNull();
  });

  it("receives disabled and reason from FormField context", () => {
    const { container } = render(
      <FormField label="Code" disabled disabledReason="Locked by admin">
        <PinInput defaultValue="1234" />
      </FormField>,
    );
    const caption = container.querySelector(".du_disabled_message");
    expect(caption).toHaveTextContent("Locked by admin");
    expect(screen.getByRole("group").getAttribute("aria-describedby")).toBe(
      caption!.id,
    );
  });
});
