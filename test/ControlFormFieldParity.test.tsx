import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormField } from "../src/components/form_field/FormField";
import { Combobox } from "../src/components/combobox/Combobox";
import { MultiSelect } from "../src/components/multi_select/MultiSelect";
import { NumberInput } from "../src/components/number_input/NumberInput";
import { DatePicker } from "../src/components/date_picker/DatePicker";
import { TimePicker } from "../src/components/time_picker/TimePicker";
import { TagInput } from "../src/components/tag_input/TagInput";
import { PinInput } from "../src/components/pin_input/PinInput";
import { Checkbox } from "../src/components/checkbox/Checkbox";
import { Switch } from "../src/components/switch/Switch";
import { RadioGroup } from "../src/components/radio/RadioGroup";
import { Radio } from "../src/components/radio/Radio";

const options = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
];

function expectAria(control: HTMLElement, withErrorMessage = true) {
  const alert = screen.getByRole("alert");
  expect(control).toHaveAttribute("aria-required", "true");
  expect(control).toHaveAttribute("aria-invalid", "true");
  expect(control.getAttribute("aria-describedby")).toContain(alert.id);
  if (withErrorMessage) {
    expect(control).toHaveAttribute("aria-errormessage", alert.id);
  }
}

describe("Tier-2 controls inherit FormField ARIA wiring", () => {
  it("Combobox", () => {
    render(
      <FormField label="Fruit" required error="Bad" hint="Pick one">
        <Combobox options={options} />
      </FormField>,
    );
    expectAria(screen.getByRole("combobox"));
  });

  it("MultiSelect", () => {
    render(
      <FormField label="Fruit" required error="Bad" hint="Pick some">
        <MultiSelect options={options} />
      </FormField>,
    );
    expectAria(screen.getByRole("combobox"));
  });

  it("NumberInput", () => {
    render(
      <FormField label="Count" required error="Bad" hint="A number">
        <NumberInput />
      </FormField>,
    );
    expectAria(screen.getByRole("spinbutton"));
  });

  it("DatePicker", () => {
    render(
      <FormField label="When" required error="Bad" hint="A date">
        <DatePicker />
      </FormField>,
    );
    expectAria(screen.getByRole("button"));
  });

  it("TimePicker", () => {
    render(
      <FormField label="When" required error="Bad" hint="A time">
        <TimePicker />
      </FormField>,
    );
    expectAria(screen.getByRole("button"));
  });

  it("TagInput", () => {
    render(
      <FormField label="Tags" required error="Bad" hint="Some tags">
        <TagInput />
      </FormField>,
    );
    expectAria(screen.getByRole("textbox"));
  });

  it("PinInput", () => {
    render(
      <FormField label="Code" required error="Bad" hint="Enter code">
        <PinInput />
      </FormField>,
    );
    expectAria(screen.getByRole("group"));
  });
});

describe("Toggle controls inherit FormField ARIA wiring", () => {
  it("Checkbox", () => {
    render(
      <FormField label="Agree" required error="Bad" hint="Please agree">
        <Checkbox />
      </FormField>,
    );
    expectAria(screen.getByRole("checkbox"), false);
  });

  it("Switch", () => {
    render(
      <FormField label="On" required error="Bad" hint="Toggle it">
        <Switch />
      </FormField>,
    );
    expectAria(screen.getByRole("switch"), false);
  });

  it("RadioGroup", () => {
    render(
      <FormField label="Pick" required error="Bad" hint="Choose">
        <RadioGroup>
          <Radio value="a" label="A" />
          <Radio value="b" label="B" />
        </RadioGroup>
      </FormField>,
    );
    expectAria(screen.getByRole("radiogroup"), false);
  });

  it("propagates field-level disabled to Checkbox and Switch", () => {
    const { rerender } = render(
      <FormField label="Agree" disabled>
        <Checkbox />
      </FormField>,
    );
    expect(screen.getByRole("checkbox")).toBeDisabled();

    rerender(
      <FormField label="On" disabled>
        <Switch />
      </FormField>,
    );
    expect(screen.getByRole("switch")).toBeDisabled();
  });
});
