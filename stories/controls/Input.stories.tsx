import type { Meta, StoryObj } from "@storybook/react";
import { Input, Stack } from "../../src";

const meta: Meta<typeof Input> = {
  title: "Controls/Input",
  component: Input,
  args: { placeholder: "Type here", size: "md" },
  parameters: {
    docs: {
      description: {
        component:
          "Single-line text field. The invalid state uses a dashed border (not color) and sets `aria-invalid`; disabled uses a dither fill with an outlined value. Use `size` (the native `size` attribute is not used). Forwards all native `input` attributes and a `ref`.",
      },
    },
  },
  argTypes: {
    size: {
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

export const WithAdornments: Story = {
  name: "Prefix / suffix",
  args: { prefix: "$", suffix: "USD", placeholder: "0.00" },
};

export const Clearable: Story = {
  args: { clearable: true, defaultValue: "clear me" },
};

/** The three sizes, stacked for comparison. */
export const Sizes: Story = {
  render: () => (
    <Stack gap={3} style={{ maxWidth: 280 }}>
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
      <Input size="lg" placeholder="Large" />
    </Stack>
  ),
};

/** Default, invalid, and disabled side by side. */
export const States: Story = {
  render: () => (
    <Stack gap={3} style={{ maxWidth: 280 }}>
      <Input placeholder="Default" />
      <Input defaultValue="Invalid value" invalid />
      <Input defaultValue="Disabled" disabled />
    </Stack>
  ),
};
