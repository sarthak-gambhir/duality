import type { Meta, StoryObj } from "@storybook/react";
import { Input, Label, Stack } from "../../src";

/**
 * A form label. Associate it with a control via `htmlFor`. The required marker
 * is `aria-hidden` - required semantics come from `aria-required` on the control
 * (FormField wires this for you). Set `disabled` to dim the label alongside a
 * disabled control.
 */
const meta: Meta<typeof Label> = {
  title: "Forms/Label",
  component: Label,
  args: { children: "Email" },
  argTypes: {
    children: { control: "text", description: "Label text." },
    required: {
      control: "boolean",
      description: "Show the (aria-hidden) required marker.",
    },
    disabled: {
      control: "boolean",
      description: "Dim the label to match a disabled control.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

/** Args-driven playground; toggle `required`/`disabled` and edit the text. */
export const Playground: Story = {};

export const Default: Story = {
  render: () => (
    <Stack gap={1}>
      <Label htmlFor="email-default">Email</Label>
      <Input id="email-default" type="email" placeholder="you@example.com" />
    </Stack>
  ),
};

export const Required: Story = {
  render: () => (
    <Stack gap={1}>
      <Label htmlFor="email-required" required>
        Email
      </Label>
      <Input id="email-required" type="email" aria-required />
    </Stack>
  ),
};

/** The disabled styling hook dims the label to match a disabled control. */
export const Disabled: Story = {
  render: () => (
    <Stack gap={1}>
      <Label htmlFor="email-disabled" disabled>
        Email
      </Label>
      <Input id="email-disabled" type="email" disabled />
    </Stack>
  ),
};
