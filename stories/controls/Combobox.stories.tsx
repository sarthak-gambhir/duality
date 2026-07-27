import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Combobox, Stack, type SelectOption } from "../../src";

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
      description: "Control size.",
      table: { defaultValue: { summary: "md" } },
    },
    invalid: {
      control: "boolean",
      description: "Marks the field invalid (dashed border + `aria-invalid`).",
    },
    disabled: { control: "boolean", description: "Disables the control." },
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

export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 260 }}>
      <Combobox
        {...args}
        options={fruits}
        placeholder="Search fruit..."
        aria-label="fruit"
      />
    </div>
  ),
};

function ControlledExample() {
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

/** Controlled `value` + `onValueChange`. */
export const Controlled: Story = {
  render: () => <ControlledExample />,
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [value, setValue] = useState("");
  return (
    <Combobox
      options={fruits}
      value={value}
      onValueChange={setValue}
      placeholder="Search fruit..."
      aria-label="fruit"
    />
  );
}`,
      },
    },
  },
};

/**
 * When disabled, the selected label stays readable on a solid background and
 * the `disabledReason` appears in a persistent caption below the input.
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

/** Invalid state: dashed border + `aria-invalid`. */
export const Invalid: Story = {
  render: () => (
    <div style={{ maxWidth: 260 }}>
      <Combobox
        options={fruits}
        defaultValue="banana"
        invalid
        placeholder="Search fruit..."
        aria-label="fruit"
      />
    </div>
  ),
};

/** The three sizes, stacked for comparison. */
export const Sizes: Story = {
  render: () => (
    <Stack gap={3} style={{ maxWidth: 260 }}>
      <Combobox size="sm" options={fruits} defaultValue="apple" aria-label="small" />
      <Combobox size="md" options={fruits} defaultValue="apple" aria-label="medium" />
      <Combobox size="lg" options={fruits} defaultValue="apple" aria-label="large" />
    </Stack>
  ),
};

/** Default, invalid, and disabled side by side. */
export const States: Story = {
  render: () => (
    <Stack gap={3} style={{ maxWidth: 260 }}>
      <Combobox options={fruits} placeholder="Default" aria-label="default" />
      <Combobox options={fruits} defaultValue="banana" invalid aria-label="invalid" />
      <Combobox options={fruits} defaultValue="banana" disabled aria-label="disabled" />
    </Stack>
  ),
};
