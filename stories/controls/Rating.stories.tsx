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

export const AllowHalf: Story = {
  name: "Half steps",
  render: () => {
    const HalfDemo = () => {
      const [value, setValue] = useState(2.5);
      return (
        <Stack gap={2}>
          <Rating
            allowHalf
            value={value}
            onValueChange={setValue}
            label="Score"
          />
          <Text size="sm">Value: {value}</Text>
        </Stack>
      );
    };
    return <HalfDemo />;
  },
};

export const Clearable: Story = {
  name: "Click to clear",
  args: { allowClear: true, defaultValue: 3, label: "Score" },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: 4 },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 3 },
};
