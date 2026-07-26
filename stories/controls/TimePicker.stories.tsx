import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TimePicker } from "../../src";

const meta: Meta<typeof TimePicker> = {
  title: "Controls/TimePicker",
  component: TimePicker,
  parameters: { docsMinHeight: 300 },
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
      description: "Show a clear button when a time is set.",
    },
    hour12: {
      control: "boolean",
      description: "Use a 12-hour clock with an AM/PM segment.",
    },
    step: {
      control: "number",
      description: "Minute increment for the minutes segment.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

export const TwentyFourHour: Story = {
  render: (args) => (
    <TimePicker {...args} defaultValue="09:30" aria-label="Meeting time" />
  ),
};
export const TwelveHour: Story = {
  render: () => (
    <TimePicker defaultValue="09:30" hour12 aria-label="Meeting time" />
  ),
};

function Controlled({ hour12 }: { hour12?: boolean }) {
  const [time, setTime] = useState<string | null>("09:30");
  return (
    <TimePicker
      value={time}
      onValueChange={setTime}
      hour12={hour12}
      aria-label="Meeting time"
    />
  );
}

/** Controlled `value` + `onValueChange`. */
export const ControlledValue: Story = {
  name: "Controlled",
  render: () => <Controlled />,
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [time, setTime] = useState<string | null>("09:30");
  return (
    <TimePicker value={time} onValueChange={setTime} aria-label="Meeting time" />
  );
}`,
      },
    },
  },
};

export const Clearable: Story = {
  render: () => (
    <TimePicker defaultValue="09:30" clearable aria-label="Meeting time" />
  ),
};

export const Constrained: Story = {
  name: "Min / max bounds",
  render: () => (
    <TimePicker
      defaultValue="10:00"
      min="09:00"
      max="17:00"
      aria-label="Meeting time"
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <TimePicker defaultValue="12:00" disabled aria-label="Meeting time" />
  ),
};

/**
 * When disabled, the selected time stays readable on a solid background and the
 * `disabledReason` appears in a persistent caption below the trigger.
 */
export const DisabledWithReason: Story = {
  render: () => (
    <TimePicker
      defaultValue="12:00"
      disabled
      disabledReason="Fixed by the event schedule"
      aria-label="Meeting time"
    />
  ),
};
