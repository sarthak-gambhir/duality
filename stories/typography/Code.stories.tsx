import type { Meta, StoryObj } from "@storybook/react";
import { Code } from "../../src";

const meta: Meta<typeof Code> = {
  title: "Typography/Code",
  component: Code,
  parameters: {
    docs: {
      description: {
        component:
          "Monospace code. Inline span by default; `block` renders a bordered `<pre>` " +
          "surface that scrolls horizontally and preserves whitespace.",
      },
    },
  },
  argTypes: {
    block: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Code>;

export const Default: Story = {
  render: () => (
    <p>
      Run <Code>pnpm build</Code> to compile the library.
    </p>
  ),
};

export const Block: Story = {
  render: () => (
    <Code block>{`function greet(name) {\n  return "Hello, " + name;\n}`}</Code>
  ),
  parameters: {
    docs: {
      description: {
        story: "`block` wraps a `<pre><code>` with a bordered, scrollable surface.",
      },
    },
  },
};
