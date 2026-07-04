import type { Meta, StoryObj } from "@storybook/react";
import { Code, Kbd } from "../../src";

const meta: Meta = {
  title: "Typography/Code & Kbd",
};

export default meta;
type Story = StoryObj;

export const Inline: Story = {
  render: () => (
    <p>
      Run <Code>pnpm build</Code> then press <Kbd>Ctrl</Kbd> + <Kbd>C</Kbd> to
      stop.
    </p>
  ),
};
