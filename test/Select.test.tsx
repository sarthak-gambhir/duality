import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Select, type SelectOption } from "../src/components/select/Select";

const options: SelectOption[] = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
  { value: "c", label: "Cherry", disabled: true },
];

function ControlledSelect() {
  const [value, setValue] = useState<string>();
  return (
    <Select
      aria-label="fruit"
      options={options}
      value={value}
      onValueChange={setValue}
    />
  );
}

describe("Select", () => {
  it("exposes a collapsed combobox and opens a listbox", async () => {
    const user = userEvent.setup();
    render(<Select aria-label="fruit" options={options} />);

    const combobox = screen.getByRole("combobox", { name: "fruit" });
    expect(combobox).toHaveAttribute("aria-expanded", "false");

    await user.click(combobox);
    expect(combobox).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("selects an option and reflects it on the trigger", async () => {
    const user = userEvent.setup();
    render(<ControlledSelect />);

    const combobox = screen.getByRole("combobox", { name: "fruit" });
    await user.click(combobox);
    await user.click(screen.getByRole("option", { name: "Banana" }));

    expect(combobox).toHaveTextContent("Banana");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("marks the selected option with aria-selected", async () => {
    const user = userEvent.setup();
    render(<Select aria-label="fruit" options={options} defaultValue="a" />);

    const combobox = screen.getByRole("combobox", { name: "fruit" });
    await user.click(combobox);
    expect(screen.getByRole("option", { name: "Apple" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("option", { name: "Banana" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("supports keyboard selection", async () => {
    const user = userEvent.setup();
    render(<ControlledSelect />);

    const combobox = screen.getByRole("combobox", { name: "fruit" });
    combobox.focus();
    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");

    expect(combobox).toHaveTextContent("Banana");
  });

  it("sets aria-invalid when invalid", () => {
    render(<Select aria-label="fruit" options={options} invalid />);
    expect(screen.getByRole("combobox", { name: "fruit" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("parses <option> children when no options prop is given", async () => {
    const user = userEvent.setup();
    render(
      <Select aria-label="fruit">
        <option value="a">Apple</option>
        <option value="b">Banana</option>
      </Select>,
    );
    await user.click(screen.getByRole("combobox", { name: "fruit" }));
    expect(screen.getAllByRole("option")).toHaveLength(2);
  });
});
