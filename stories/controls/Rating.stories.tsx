import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Rating, Stack, Text } from "../../src";

const meta: Meta<typeof Rating> = {
  title: "Controls/Rating",
  component: Rating,
  args: { max: 5, size: "md" },
  parameters: {
    docs: {
      description: {
        component:
          "Pixel-block rating where fill (never color) conveys the value: filled blocks are `--fg`, empty blocks are outlined, half blocks are split. Supports half steps, clearing, read-only, and disabled states.",
      },
    },
  },
  argTypes: {
    max: { control: "number", description: "Number of blocks." },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
      description: "Control size.",
      table: { defaultValue: { summary: "md" } },
    },
    allowHalf: { control: "boolean", description: "Allow half-block increments." },
    allowClear: {
      control: "boolean",
      description: "Clicking the current value (or Home) resets to 0.",
    },
    readOnly: { control: "boolean", description: "Non-interactive display." },
    disabled: { control: "boolean", description: "Disable interaction." },
    label: { control: "text", description: "Accessible group label." },
  },
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

export const Default: Story = {
  render: (args) => <Demo {...args} />,
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [value, setValue] = useState(3);
  return <Rating value={value} onValueChange={setValue} label="Score" />;
}`,
      },
    },
  },
};

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
