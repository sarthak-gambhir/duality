import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../src";

const meta: Meta<typeof Button> = {
  title: "Controls/Button",
  component: Button,
  args: { children: "Button", variant: "solid", size: "md" },
  parameters: {
    docs: {
      description: {
        component:
          "Primary action control. `solid` is filled, `inverse` is outlined, `ghost` is borderless; all invert on hover. Disabled uses a dither fill with an outlined label. Forwards all native `button` attributes and a `ref`.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["solid", "inverse", "ghost"],
      description: "Visual style.",
      table: { defaultValue: { summary: "solid" } },
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
      description: "Control size.",
      table: { defaultValue: { summary: "md" } },
    },
    children: { control: "text", description: "Button label." },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-3)" }}>
      <Button variant="solid">Solid</Button>
      <Button variant="inverse">Inverse</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div
      style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}
    >
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};
