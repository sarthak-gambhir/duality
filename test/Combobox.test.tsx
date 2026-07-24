import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Combobox } from "../src/components/combobox/Combobox";
import type { SelectOption } from "../src/components/select/Select";

const options: SelectOption[] = [
  { value: "apple", label: "Apple" },
  { value: "apricot", label: "Apricot" },
  { value: "banana", label: "Banana" },
];

describe("Combobox", () => {
  it("filters options as the user types", async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} aria-label="fruit" />);

    const input = screen.getByRole("combobox", { name: "fruit" });
    await user.type(input, "ap");

    expect(screen.getByRole("option", { name: /Apple/ })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Apricot/ })).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: /Banana/ }),
    ).not.toBeInTheDocument();
  });

  it("selects an option with keyboard and reflects the value", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Combobox
        options={options}
        aria-label="fruit"
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByRole("combobox", { name: "fruit" });
    await user.type(input, "ban");
    await user.keyboard("{ArrowDown}{Enter}");

    expect(onValueChange).toHaveBeenLastCalledWith("banana");
    expect(input).toHaveValue("Banana");
  });

  it("shows a no-matches message when nothing matches", async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} aria-label="fruit" />);
    await user.type(screen.getByRole("combobox", { name: "fruit" }), "zzz");
    expect(screen.getByText("No matches")).toBeInTheDocument();
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
  });
});

describe("Combobox disabled tooltip", () => {
  it("shows the selected label in a hover tooltip when disabled", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Combobox
        options={options}
        defaultValue="banana"
        disabled
        aria-label="fruit"
      />,
    );
    const root = container.querySelector(".du_disabled_tooltip");
    expect(root).not.toBeNull();
    await user.hover(root!);
    const tip = await screen.findByRole("tooltip");
    expect(tip).toHaveTextContent("Value: Banana");
  });

  it("shows the reason when disabled", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Combobox
        options={options}
        defaultValue="banana"
        disabled
        disabledReason="Fixed for this order"
        aria-label="fruit"
      />,
    );
    await user.hover(container.querySelector(".du_disabled_tooltip")!);
    const tip = await screen.findByRole("tooltip");
    expect(tip).toHaveTextContent("Disabled due to: Fixed for this order");
  });

  it("does not wrap when enabled", () => {
    const { container } = render(
      <Combobox options={options} defaultValue="banana" aria-label="fruit" />,
    );
    expect(container.querySelector(".du_disabled_tooltip")).toBeNull();
  });
});
