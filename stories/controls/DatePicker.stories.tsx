import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker, Stack, Text } from "../../src";

const meta: Meta<typeof DatePicker> = {
  title: "Controls/DatePicker",
  component: DatePicker,
  parameters: { docsMinHeight: 380 },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

function Demo() {
  const [value, setValue] = useState<Date | null>(new Date(2026, 6, 15));
  return (
    <Stack gap={2} style={{ maxWidth: 280 }}>
      <DatePicker value={value} onValueChange={setValue} aria-label="date" />
      <Text size="sm">{value ? value.toDateString() : "No date"}</Text>
    </Stack>
  );
}

export const Default: Story = { render: () => <Demo /> };

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
