import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../../src";

const meta: Meta<typeof Input> = {
  title: "Controls/Input",
  component: Input,
  args: { placeholder: "Type here", inputSize: "md" },
  parameters: {
    docs: {
      description: {
        component:
          "Single-line text field. The invalid state uses a dashed border (not color) and sets `aria-invalid`; disabled uses a dither fill with an outlined value. Use `inputSize` instead of the native `size`. Forwards all native `input` attributes and a `ref`.",
      },
    },
  },
  argTypes: {
    inputSize: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
      description: "Control size (native `size` is not used).",
      table: { defaultValue: { summary: "md" } },
    },
    invalid: {
      control: "boolean",
      description: "Marks the field invalid (dashed border + `aria-invalid`).",
    },
  },
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
