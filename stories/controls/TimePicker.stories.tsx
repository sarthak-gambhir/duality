import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TimePicker } from "../../src";

const meta: Meta<typeof TimePicker> = {
  title: "Controls/TimePicker",
  component: TimePicker,
  parameters: { docsMinHeight: 300 },
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

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

export const TwentyFourHour: Story = { render: () => <Controlled /> };
export const TwelveHour: Story = { render: () => <Controlled hour12 /> };

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
