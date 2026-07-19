import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "../../src";

const meta: Meta<typeof Textarea> = {
  title: "Controls/Textarea",
  component: Textarea,
  args: { placeholder: "Write a message", rows: 4 },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {};

export const Invalid: Story = {
  args: { invalid: true, defaultValue: "needs fixing" },
};

export const Autosize: Story = {
  args: {
    autosize: true,
    minRows: 2,
    maxRows: 8,
    defaultValue: "This field grows as you type.\nTry adding more lines.",
    rows: undefined,
  },
};

export const WithCount: Story = {
  name: "Character count",
  args: { showCount: true, maxLength: 120, defaultValue: "Counting..." },
};
