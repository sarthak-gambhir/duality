import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "../src/components/input/Input";
import { Textarea } from "../src/components/textarea/Textarea";
import { Select } from "../src/components/select/Select";

const options = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
];

describe("Standalone disabled reason caption", () => {
  it("Input renders the caption and wires aria-describedby", () => {
    const { container } = render(
      <Input
        aria-label="Account"
        disabled
        disabledReason="Managed by admin"
        defaultValue="acct_1"
      />,
    );
    const caption = container.querySelector(".du_disabled_message");
    expect(caption).toHaveTextContent("Managed by admin");
    expect(
      screen.getByRole("textbox").getAttribute("aria-describedby"),
    ).toContain(caption!.id);
  });

  it("Textarea renders the caption and wires aria-describedby", () => {
    const { container } = render(
      <Textarea
        aria-label="Notes"
        disabled
        disabledReason="Read only"
        defaultValue="hello"
      />,
    );
    const caption = container.querySelector(".du_disabled_message");
    expect(caption).toHaveTextContent("Read only");
    expect(
      screen.getByRole("textbox").getAttribute("aria-describedby"),
    ).toContain(caption!.id);
  });

  it("Select renders the caption and wires aria-describedby", () => {
    const { container } = render(
      <Select
        aria-label="Fruit"
        options={options}
        defaultValue="a"
        disabled
        disabledReason="Locked"
      />,
    );
    const caption = container.querySelector(".du_disabled_message");
    expect(caption).toHaveTextContent("Locked");
    expect(
      screen.getByRole("combobox").getAttribute("aria-describedby"),
    ).toContain(caption!.id);
  });

  it("renders no caption when disabled without a reason", () => {
    const { container } = render(
      <Input aria-label="Account" disabled defaultValue="acct_1" />,
    );
    expect(container.querySelector(".du_disabled_message")).toBeNull();
  });
});
