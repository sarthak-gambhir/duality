import type { Meta, StoryObj } from "@storybook/react";
import { NumberInput, Stack } from "../../src";

const meta: Meta<typeof NumberInput> = {
  title: "Controls/NumberInput",
  component: NumberInput,
  args: {
    min: 0,
    max: 10,
    step: 1,
    size: "md",
    defaultValue: 3,
    "aria-label": "quantity",
  },
  decorators: [(Story) => <div style={{ maxWidth: 220 }}><Story /></div>],
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
      description: "Control size.",
      table: { defaultValue: { summary: "md" } },
    },
    invalid: {
      control: "boolean",
      description: "Marks the field invalid (dashed border + `aria-invalid`).",
    },
    disabled: { control: "boolean", description: "Disables the control." },
    hideSteppers: {
      control: "boolean",
      description: "Hide the increment/decrement buttons.",
    },
    min: { control: "number", description: "Minimum allowed value." },
    max: { control: "number", description: "Maximum allowed value." },
    step: { control: "number", description: "Increment applied by steppers/arrows." },
    prefix: { control: "text", description: "Leading adornment (e.g. a currency symbol)." },
    suffix: { control: "text", description: "Trailing adornment (e.g. a unit)." },
  },
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {};

export const Invalid: Story = {
  args: { invalid: true },
};

export const WithUnits: Story = {
  name: "Prefix / suffix",
  args: { prefix: "$", suffix: "USD", min: 0, max: 1000, step: 10, defaultValue: 100 },
};

export const HideSteppers: Story = {
  args: { hideSteppers: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

/**
 * When disabled, the value stays readable on a solid background and the
 * `disabledReason` appears in a persistent caption below the field.
 */
export const DisabledWithReason: Story = {
  args: { disabled: true, disabledReason: "Set by your plan tier" },
};

/**
 * `precision` fixes the number of decimals; `step` and `largeStep` (PageUp/Down)
 * control the increments applied by the steppers and keyboard.
 */
export const Precision: Story = {
  args: {
    defaultValue: 1.5,
    min: 0,
    max: 10,
    step: 0.1,
    largeStep: 1,
    precision: 2,
    suffix: "kg",
  },
};

/** The three sizes, stacked for comparison. */
export const Sizes: Story = {
  render: () => (
    <Stack gap={3}>
      <NumberInput size="sm" defaultValue={3} aria-label="small" />
      <NumberInput size="md" defaultValue={3} aria-label="medium" />
      <NumberInput size="lg" defaultValue={3} aria-label="large" />
    </Stack>
  ),
};

/** Default, invalid, and disabled side by side. */
export const States: Story = {
  render: () => (
    <Stack gap={3}>
      <NumberInput defaultValue={3} aria-label="default" />
      <NumberInput defaultValue={3} invalid aria-label="invalid" />
      <NumberInput defaultValue={3} disabled aria-label="disabled" />
    </Stack>
  ),
};
