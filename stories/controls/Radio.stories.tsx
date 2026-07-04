import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Radio, RadioGroup } from "../../src";

const meta: Meta<typeof RadioGroup> = {
  title: "Controls/Radio",
  component: RadioGroup,
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

function ControlledGroup() {
  const [value, setValue] = useState("one");
  return (
    <RadioGroup label="Pick one" value={value} onValueChange={setValue}>
      <Radio value="one" label="Option one" />
      <Radio value="two" label="Option two" />
      <Radio value="three" label="Option three" />
    </RadioGroup>
  );
}

export const Group: Story = {
  render: () => <ControlledGroup />,
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup label="Disabled" value="one" disabled>
      <Radio value="one" label="Option one" />
      <Radio value="two" label="Option two" />
    </RadioGroup>
  ),
};
