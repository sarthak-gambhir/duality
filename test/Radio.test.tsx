import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Radio } from "../src/components/radio/Radio";
import { RadioGroup } from "../src/components/radio/RadioGroup";

function ControlledGroup() {
  const [value, setValue] = useState("one");
  return (
    <RadioGroup label="Pick" value={value} onValueChange={setValue}>
      <Radio value="one" label="One" />
      <Radio value="two" label="Two" />
    </RadioGroup>
  );
}

describe("RadioGroup + Radio", () => {
  it("exposes a radiogroup and selects a value", async () => {
    const user = userEvent.setup();
    render(<ControlledGroup />);

    expect(
      screen.getByRole("radiogroup", { name: "Pick" }),
    ).toBeInTheDocument();
    const one = screen.getByRole("radio", { name: "One" });
    const two = screen.getByRole("radio", { name: "Two" });

    expect(one).toBeChecked();
    await user.click(two);
    expect(two).toBeChecked();
    expect(one).not.toBeChecked();
  });

  it("supports uncontrolled selection via defaultValue", async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup label="Pick" defaultValue="one">
        <Radio value="one" label="One" />
        <Radio value="two" label="Two" />
      </RadioGroup>,
    );
    const one = screen.getByRole("radio", { name: "One" });
    const two = screen.getByRole("radio", { name: "Two" });
    expect(one).toBeChecked();
    await user.click(two);
    expect(two).toBeChecked();
    expect(one).not.toBeChecked();
  });

  it("reflects orientation on the group", () => {
    render(
      <RadioGroup label="Pick" defaultValue="one" orientation="horizontal">
        <Radio value="one" label="One" />
        <Radio value="two" label="Two" />
      </RadioGroup>,
    );
    expect(screen.getByRole("radiogroup", { name: "Pick" })).toHaveAttribute(
      "aria-orientation",
      "horizontal",
    );
  });

  it("shares a name and honors group disabled", () => {
    render(
      <RadioGroup label="Pick" value="one" disabled>
        <Radio value="one" label="One" />
        <Radio value="two" label="Two" />
      </RadioGroup>,
    );
    const one = screen.getByRole("radio", { name: "One" });
    const two = screen.getByRole("radio", { name: "Two" });
    expect(one).toBeDisabled();
    expect(two).toBeDisabled();
    expect(one.getAttribute("name")).toBe(two.getAttribute("name"));
  });
});
