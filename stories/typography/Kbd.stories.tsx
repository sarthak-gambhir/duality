import type { Meta, StoryObj } from "@storybook/react";
import { Kbd } from "../../src";

const meta: Meta<typeof Kbd> = {
  title: "Typography/Kbd",
  component: Kbd,
  parameters: {
    docs: {
      description: {
        component:
          "Keyboard key hint with a pixel border. A single child renders one cap; pass " +
          "`keys` to render a combo of capped keys joined by `separator` (default `+`).",
      },
    },
  },
  argTypes: {
    separator: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Kbd>;

export const Default: Story = {
  render: () => (
    <p>
      Press <Kbd>Esc</Kbd> to dismiss.
    </p>
  ),
};

export const Combo: Story = {
  render: () => (
    <p>
      Save with <Kbd keys={["Ctrl", "S"]} /> or open search with{" "}
      <Kbd keys={["Ctrl", "K"]} />.
    </p>
  ),
  parameters: {
    docs: {
      description: {
        story: "`keys` renders each entry as its own cap, joined by the separator.",
      },
    },
  },
};

export const CustomSeparator: Story = {
  render: () => <Kbd keys={["Cmd", "Shift", "P"]} separator="›" />,
};
