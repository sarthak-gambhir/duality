import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NumberInput } from "../../src";

const meta: Meta<typeof NumberInput> = {
  title: "Controls/NumberInput",
  component: NumberInput,
  args: { min: 0, max: 10, step: 1, size: "md" },
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

function Demo(args: React.ComponentProps<typeof NumberInput>) {
  const [value, setValue] = useState<number | undefined>(3);
  return (
    <div style={{ maxWidth: 200 }}>
      <NumberInput
        {...args}
        value={value}
        onValueChange={setValue}
        aria-label="quantity"
      />
    </div>
  );
}

export const Default: Story = { render: (args) => <Demo {...args} /> };
export const Invalid: Story = {
  render: (args) => <Demo {...args} />,
  args: { invalid: true },
};

export const WithUnits: Story = {
  name: "Prefix / suffix",
  render: (args) => <Demo {...args} />,
  args: { prefix: "$", suffix: "USD", min: 0, max: 1000, step: 10 },
};

export const HideSteppers: Story = {
  render: (args) => <Demo {...args} />,
  args: { hideSteppers: true },
};

export const Disabled: Story = {
  render: (args) => <Demo {...args} />,
  args: { disabled: true },
};
