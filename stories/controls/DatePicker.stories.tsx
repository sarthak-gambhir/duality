import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker, Stack, Text } from "../../src";

const meta: Meta<typeof DatePicker> = {
  title: "Controls/DatePicker",
  component: DatePicker,
  parameters: { docsMinHeight: 380 },
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
    clearable: {
      control: "boolean",
      description: "Show a clear button when a date is set.",
    },
    weekStartsOn: {
      control: { type: "inline-radio" },
      options: [0, 1],
      description: "First day of the week (0 = Sunday, 1 = Monday).",
    },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: (args) => (
    <DatePicker {...args} defaultValue={new Date(2026, 6, 15)} aria-label="date" />
  ),
};

function Controlled() {
  const [value, setValue] = useState<Date | null>(new Date(2026, 6, 15));
  return (
    <Stack gap={2} style={{ maxWidth: 280 }}>
      <DatePicker value={value} onValueChange={setValue} aria-label="date" />
      <Text size="sm">{value ? value.toDateString() : "No date"}</Text>
    </Stack>
  );
}

/** Controlled `value` + `onValueChange`, echoing the current selection. */
export const ControlledValue: Story = {
  name: "Controlled",
  render: () => <Controlled />,
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [value, setValue] = useState<Date | null>(new Date(2026, 6, 15));
  return (
    <Stack gap={2}>
      <DatePicker value={value} onValueChange={setValue} aria-label="date" />
      <Text size="sm">{value ? value.toDateString() : "No date"}</Text>
    </Stack>
  );
}`,
      },
    },
  },
};

export const Clearable: Story = {
  render: () => (
    <DatePicker
      defaultValue={new Date(2026, 6, 15)}
      clearable
      aria-label="date"
    />
  ),
};

export const MondayStart: Story = {
  name: "Week starts Monday",
  render: () => (
    <DatePicker
      defaultValue={new Date(2026, 6, 15)}
      weekStartsOn={1}
      aria-label="date"
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <DatePicker
      defaultValue={new Date(2026, 6, 15)}
      disabled
      aria-label="date"
    />
  ),
};

/**
 * When disabled, the selected date stays readable on a solid background and the
 * `disabledReason` appears in a persistent caption below the trigger.
 */
export const DisabledWithReason: Story = {
  render: () => (
    <DatePicker
      defaultValue={new Date(2026, 6, 15)}
      disabled
      disabledReason="Billing period is locked"
      aria-label="date"
    />
  ),
};
