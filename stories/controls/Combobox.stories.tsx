import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Combobox, type SelectOption } from "../../src";

const meta: Meta<typeof Combobox> = {
  title: "Controls/Combobox",
  component: Combobox,
  parameters: {
    docsMinHeight: 300,
    docs: {
      description: {
        component:
          "Editable ARIA combobox over a filtered listbox. Filters options as you type (custom `filter` supported), supports controlled/uncontrolled value and input text, and mirrors the value to a hidden input when `name` is set. Reuses the Select listbox styling under the two-color model.",
      },
    },
  },
  argTypes: {
    options: {
      control: false,
      description: "Options to filter and choose from.",
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
      table: { defaultValue: { summary: "md" } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Combobox>;

const fruits: SelectOption[] = [
  { value: "apple", label: "Apple" },
  { value: "apricot", label: "Apricot" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date", disabled: true },
  { value: "grape", label: "Grape" },
];

function Demo() {
  const [value, setValue] = useState("");
  return (
    <div style={{ maxWidth: 260 }}>
      <Combobox
        options={fruits}
        value={value}
        onValueChange={setValue}
        placeholder="Search fruit..."
        aria-label="fruit"
      />
    </div>
  );
}

export const Default: Story = { render: () => <Demo /> };

/**
 * When disabled, hovering the input shows the selected label (and an optional
 * `disabledReason`) in a tooltip. Hover-only, since disabled controls cannot
 * receive keyboard focus.
 */
export const DisabledWithReason: Story = {
  render: () => (
    <div style={{ maxWidth: 260 }}>
      <Combobox
        options={fruits}
        defaultValue="banana"
        disabled
        disabledReason="Selection is fixed for this order"
        placeholder="Search fruit..."
        aria-label="fruit"
      />
    </div>
  ),
};
