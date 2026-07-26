import type { Meta, StoryObj } from "@storybook/react";
import { Stack, Textarea } from "../../src";

const meta: Meta<typeof Textarea> = {
  title: "Controls/Textarea",
  component: Textarea,
  args: { placeholder: "Write a message", rows: 4 },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
      description: "Control size.",
      table: { defaultValue: { summary: "md" } },
    },
    invalid: {
      control: "boolean",
      description: "Marks the field invalid (border-style change + `aria-invalid`).",
    },
    disabled: { control: "boolean", description: "Disables the control." },
    autosize: {
      control: "boolean",
      description: "Grow the field to fit its content.",
    },
    showCount: {
      control: "boolean",
      description: "Show a character counter (uses `maxLength` when set).",
    },
    minRows: { control: "number", description: "Minimum visible rows." },
    maxRows: {
      control: "number",
      description: "Maximum rows before scrolling (with `autosize`).",
    },
  },
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

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Read-only content" },
};

/**
 * When disabled, the value stays readable on a solid background and the
 * `disabledReason` appears in a persistent caption below the field.
 */
export const DisabledWithReason: Story = {
  args: {
    disabled: true,
    defaultValue: "Terms accepted on 2026-01-14",
    disabledReason: "Locked after acceptance",
  },
};

/** The three sizes, stacked for comparison. */
export const Sizes: Story = {
  render: () => (
    <Stack gap={3} style={{ maxWidth: 320 }}>
      <Textarea size="sm" rows={2} placeholder="Small" />
      <Textarea size="md" rows={2} placeholder="Medium" />
      <Textarea size="lg" rows={2} placeholder="Large" />
    </Stack>
  ),
};

/** Default, invalid, and disabled side by side. */
export const States: Story = {
  render: () => (
    <Stack gap={3} style={{ maxWidth: 320 }}>
      <Textarea rows={2} placeholder="Default" />
      <Textarea rows={2} defaultValue="Invalid content" invalid />
      <Textarea rows={2} defaultValue="Disabled content" disabled />
    </Stack>
  ),
};
