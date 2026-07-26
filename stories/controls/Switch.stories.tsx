import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "../../src";

const meta: Meta<typeof Switch> = {
  title: "Controls/Switch",
  component: Switch,
  args: { label: "Enable notifications" },
  argTypes: {
    label: { control: "text", description: "Text shown next to the switch." },
    disabled: { control: "boolean", description: "Disables the control." },
    defaultChecked: {
      control: "boolean",
      description: "Initial on/off state (uncontrolled).",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {};
export const On: Story = { args: { defaultChecked: true } };
export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true },
};
