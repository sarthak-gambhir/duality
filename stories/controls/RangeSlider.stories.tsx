import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RangeSlider, Stack, Text } from "../../src";

const meta: Meta<typeof RangeSlider> = {
  title: "Controls/RangeSlider",
  component: RangeSlider,
  args: { min: 0, max: 100, step: 1 },
};

export default meta;
type Story = StoryObj<typeof RangeSlider>;

function Demo(args: React.ComponentProps<typeof RangeSlider>) {
  const [value, setValue] = useState<[number, number]>([20, 80]);
  return (
    <Stack gap={3} style={{ maxWidth: 320 }}>
      <RangeSlider {...args} value={value} onValueChange={setValue} />
      <Text size="sm">
        {value[0]} - {value[1]}
      </Text>
    </Stack>
  );
}

export const Default: Story = { render: (args) => <Demo {...args} /> };
export const Disabled: Story = {
  render: () => <RangeSlider defaultValue={[30, 70]} disabled />,
};
