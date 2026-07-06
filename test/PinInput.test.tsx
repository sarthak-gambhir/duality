import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
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
