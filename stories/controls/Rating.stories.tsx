import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Rating, Stack, Text } from "../../src";

const meta: Meta<typeof Rating> = {
  title: "Controls/Rating",
  component: Rating,
  args: { max: 5, size: "md" },
};

export default meta;
type Story = StoryObj<typeof Rating>;

function Demo(args: React.ComponentProps<typeof Rating>) {
  const [value, setValue] = useState(3);
  return (
    <Stack gap={2}>
      <Rating {...args} value={value} onValueChange={setValue} label="Score" />
      <Text size="sm">Value: {value}</Text>
    </Stack>
  );
}

export const Default: Story = { render: (args) => <Demo {...args} /> };
export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: 4 },
};
