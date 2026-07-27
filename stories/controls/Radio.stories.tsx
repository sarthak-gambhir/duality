import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Radio, RadioGroup } from "../../src";

const meta: Meta<typeof RadioGroup> = {
  title: "Controls/Radio",
  component: RadioGroup,
  parameters: {
    docs: {
      description: {
        component:
          "Two-color radio group. `RadioGroup` wires shared name/value/onChange to its child `Radio`s and supports controlled (`value`) or uncontrolled (`defaultValue`) selection.",
      },
    },
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      description: "Layout direction of the radios.",
      table: { defaultValue: { summary: "vertical" } },
    },
    disabled: {
      control: "boolean",
      description: "Disables every radio in the group.",
    },
    label: { control: "text", description: "Accessible group label." },
    name: { control: "text", description: "Shared input name (auto when omitted)." },
  },
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

export const Default: Story = {
  render: () => <ControlledGroup />,
};

export const Uncontrolled: Story = {
  name: "Uncontrolled (defaultValue)",
  render: () => (
    <RadioGroup label="Pick one" defaultValue="two">
      <Radio value="one" label="Option one" />
      <Radio value="two" label="Option two" />
      <Radio value="three" label="Option three" />
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup label="Pick one" defaultValue="one" orientation="horizontal">
      <Radio value="one" label="One" />
      <Radio value="two" label="Two" />
      <Radio value="three" label="Three" />
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup label="Disabled" value="one" disabled>
      <Radio value="one" label="Option one" />
      <Radio value="two" label="Option two" />
    </RadioGroup>
  ),
};
