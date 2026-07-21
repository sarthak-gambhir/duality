import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "../../src";

const meta: Meta<typeof Checkbox> = {
  title: "Controls/Checkbox",
  component: Checkbox,
  args: { label: "Accept terms" },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };

function IndeterminateDemo() {
  const [indeterminate, setIndeterminate] = useState(true);
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      label="Accept terms"
      indeterminate={indeterminate}
      checked={checked}
      onChange={(e) => {
        setIndeterminate(false);
        setChecked(e.target.checked);
      }}
    />
  );
}

export const Indeterminate: Story = { render: () => <IndeterminateDemo /> };
export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true },
};
