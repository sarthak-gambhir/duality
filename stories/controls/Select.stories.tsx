import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Select, type SelectOption } from "../../src";

const meta: Meta<typeof Select> = {
  title: "Controls/Select",
  component: Select,
  args: { selectSize: "md" },
  parameters: { docsMinHeight: 280 },
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

export const Selected: Story = { render: () => <Controlled /> };

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
