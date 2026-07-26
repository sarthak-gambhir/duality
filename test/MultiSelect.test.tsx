import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { MultiSelect } from "../src/components/multi_select/MultiSelect";
import type { SelectOption } from "../src/components/select/Select";

const options: SelectOption[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
];

function Harness() {
  const [value, setValue] = useState<string[]>([]);
  return (
    <MultiSelect
      options={options}
      value={value}
      onValueChange={setValue}
      aria-label="frameworks"
    />
  );
}

describe("MultiSelect", () => {
  it("selects and deselects options, keeping the listbox open", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const input = screen.getByRole("combobox", { name: "frameworks" });
    await user.click(input);

    await user.click(screen.getByRole("option", { name: "React" }));
    expect(screen.getByRole("option", { name: "React" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.click(screen.getByRole("option", { name: "Vue" }));
    expect(
      screen.getByRole("button", { name: "Remove React" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Remove Vue" }),
    ).toBeInTheDocument();
  });

  it("removes a chip via its remove button", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("combobox", { name: "frameworks" }));
    await user.click(screen.getByRole("option", { name: "React" }));

    await user.click(screen.getByRole("button", { name: "Remove React" }));
    expect(
      screen.queryByRole("button", { name: "Remove React" }),
    ).not.toBeInTheDocument();
  });

  it("removes the last chip on Backspace with an empty input", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const input = screen.getByRole("combobox", { name: "frameworks" });
    await user.click(input);
    await user.click(screen.getByRole("option", { name: "React" }));
    await user.click(screen.getByRole("option", { name: "Vue" }));

    input.focus();
    await user.keyboard("{Backspace}");
    expect(
      screen.queryByRole("button", { name: "Remove Vue" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Remove React" }),
    ).toBeInTheDocument();
  });
});

describe("MultiSelect disabled reason caption", () => {
  it("renders the reason caption and wires it via aria-describedby", () => {
    const { container } = render(
      <MultiSelect
        options={options}
        defaultValue={["react"]}
        disabled
        disabledReason="Locked for this project"
        aria-label="frameworks"
      />,
    );
    const caption = container.querySelector(".du_disabled_message");
    expect(caption).toHaveTextContent("Locked for this project");
    expect(screen.getByRole("combobox").getAttribute("aria-describedby")).toBe(
      caption!.id,
    );
  });

  it("renders no caption when disabled without a reason", () => {
    const { container } = render(
      <MultiSelect
        options={options}
        defaultValue={["react", "svelte"]}
        disabled
        aria-label="frameworks"
      />,
    );
    expect(container.querySelector(".du_disabled_message")).toBeNull();
    expect(container.querySelector(".du_disabled_message_wrap")).toBeNull();
  });

  it("renders no caption when enabled", () => {
    const { container } = render(
      <MultiSelect
        options={options}
        defaultValue={["react"]}
        aria-label="frameworks"
      />,
    );
    expect(container.querySelector(".du_disabled_message")).toBeNull();
  });
});
