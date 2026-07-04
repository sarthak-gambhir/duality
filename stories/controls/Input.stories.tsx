import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../../src";

const meta: Meta<typeof Input> = {
  title: "Controls/Input",
  component: Input,
  args: { placeholder: "Type here", inputSize: "md" },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const Invalid: Story = {
  args: { invalid: true, defaultValue: "bad value" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "disabled" },
};
