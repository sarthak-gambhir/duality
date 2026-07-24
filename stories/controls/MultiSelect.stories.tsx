import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MultiSelect, type SelectOption } from "../../src";

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

function Demo() {
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

export const Default: Story = { render: () => <Demo /> };

/**
 * When disabled, hovering the control shows the selected labels (and an
 * optional `disabledReason`) in a tooltip. Hover-only, since disabled controls
 * cannot receive keyboard focus.
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
