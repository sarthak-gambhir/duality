import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Select, Stack, type SelectOption } from "../../src";

const meta: Meta<typeof Select> = {
  title: "Controls/Select",
  component: Select,
  args: { size: "md" },
  parameters: {
    docsMinHeight: 280,
    docs: {
      description: {
        component:
          "Custom accessible single-select built on the ARIA combobox/listbox pattern (not a native `<select>`), so it fully follows the two-color model. Accepts an `options` array or `<option>` children, supports controlled (`value` + `onValueChange`) and uncontrolled (`defaultValue`) use, and mirrors the value to a hidden input when `name` is set. Keyboard: arrows, Home/End, type-ahead, Enter, Escape.",
      },
    },
  },
  argTypes: {
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
    options: {
      control: false,
      description: "Options array (or pass `<option>` children).",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const options: SelectOption[] = [
  { value: "classic", label: "Classic" },
  { value: "paper", label: "Paper" },
  { value: "amber", label: "Amber" },
  { value: "phosphor", label: "Phosphor" },
  { value: "crt", label: "CRT (unavailable)", disabled: true },
];

export const Default: Story = {
  render: (args) => (
    <Select {...args} options={options} placeholder="Pick a palette" />
  ),
};

function Controlled() {
  const [value, setValue] = useState("classic");
  return (
    <Select
      options={options}
      value={value}
      onValueChange={setValue}
      aria-label="palette"
    />
  );
}

export const Selected: Story = {
  render: () => <Controlled />,
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [value, setValue] = useState("classic");
  return (
    <Select
      options={options}
      value={value}
      onValueChange={setValue}
      aria-label="palette"
    />
  );
}`,
      },
    },
  },
};

export const Invalid: Story = {
  render: (args) => (
    <Select {...args} options={options} defaultValue="amber" invalid />
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Select {...args} options={options} defaultValue="amber" disabled />
  ),
};

export const FromOptionChildren: Story = {
  render: (args) => (
    <Select {...args} aria-label="palette">
      <option value="classic">Classic</option>
      <option value="paper">Paper</option>
    </Select>
  ),
};

/** The three sizes, stacked for comparison. */
export const Sizes: Story = {
  render: () => (
    <Stack gap={3} style={{ maxWidth: 280 }}>
      <Select size="sm" options={options} defaultValue="classic" aria-label="small" />
      <Select size="md" options={options} defaultValue="classic" aria-label="medium" />
      <Select size="lg" options={options} defaultValue="classic" aria-label="large" />
    </Stack>
  ),
};

/** Default, invalid, and disabled side by side. */
export const States: Story = {
  render: () => (
    <Stack gap={3} style={{ maxWidth: 280 }}>
      <Select options={options} placeholder="Default" aria-label="default" />
      <Select options={options} defaultValue="amber" invalid aria-label="invalid" />
      <Select options={options} defaultValue="amber" disabled aria-label="disabled" />
    </Stack>
  ),
};
