import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MultiSelect, Stack, type SelectOption } from "../../src";

const meta: Meta<typeof MultiSelect> = {
  title: "Controls/MultiSelect",
  component: MultiSelect,
  parameters: {
    docsMinHeight: 320,
    docs: {
      description: {
        component:
          "Multi-value combobox. Selected options appear as removable Badge chips; the listbox stays open (aria-multiselectable) so you can toggle several, and Backspace on an empty input removes the last chip. Mirrors the selected values to hidden inputs when name is set.",
      },
    },
  },
  argTypes: {
    options: { control: false, description: "Options to choose from." },
    invalid: {
      control: "boolean",
      description: "Marks the field invalid (dashed border + `aria-invalid`).",
    },
    disabled: { control: "boolean", description: "Disables the control." },
  },
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

const options: SelectOption[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
  { value: "angular", label: "Angular", disabled: true },
  { value: "qwik", label: "Qwik" },
];

export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <MultiSelect
        {...args}
        options={options}
        defaultValue={["react"]}
        placeholder="Pick frameworks..."
        aria-label="frameworks"
      />
    </div>
  ),
};

function ControlledExample() {
  const [value, setValue] = useState<string[]>(["react"]);
  return (
    <div style={{ maxWidth: 320 }}>
      <MultiSelect
        options={options}
        value={value}
        onValueChange={setValue}
        placeholder="Pick frameworks..."
        aria-label="frameworks"
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
  const [value, setValue] = useState<string[]>(["react"]);
  return (
    <MultiSelect
      options={options}
      value={value}
      onValueChange={setValue}
      placeholder="Pick frameworks..."
      aria-label="frameworks"
    />
  );
}`,
      },
    },
  },
};

/**
 * When disabled, the value stays readable on a solid background and the
 * `disabledReason` appears in a persistent caption below the control.
 */
export const DisabledWithReason: Story = {
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <MultiSelect
        options={options}
        defaultValue={["react", "svelte"]}
        disabled
        disabledReason="Framework set is locked for this project"
        placeholder="Pick frameworks..."
        aria-label="frameworks"
      />
    </div>
  ),
};

/** Invalid state: dashed border + `aria-invalid`. */
export const Invalid: Story = {
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <MultiSelect
        options={options}
        defaultValue={["react"]}
        invalid
        placeholder="Pick frameworks..."
        aria-label="frameworks"
      />
    </div>
  ),
};

/** Default, invalid, and disabled side by side. */
export const States: Story = {
  render: () => (
    <Stack gap={3} style={{ maxWidth: 320 }}>
      <MultiSelect options={options} placeholder="Default" aria-label="default" />
      <MultiSelect
        options={options}
        defaultValue={["react"]}
        invalid
        aria-label="invalid"
      />
      <MultiSelect
        options={options}
        defaultValue={["react"]}
        disabled
        aria-label="disabled"
      />
    </Stack>
  ),
};
