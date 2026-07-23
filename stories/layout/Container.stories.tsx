import type { Meta, StoryObj } from "@storybook/react";
import { Container } from "../../src";
import { Cell } from "./_demo";

const meta: Meta<typeof Container> = {
  title: "Layout/Container",
  component: Container,
  args: { size: "lg" },
  parameters: {
    docs: {
      description: {
        component:
          "Centered, max-width page wrapper with horizontal padding. Choose a `size` " +
          "preset (`--container-*`) or set a custom `maxWidth`. Use `as=\"main\"` for the " +
          "primary landmark.",
      },
    },
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg", "xl"],
      description: "Max-width preset. Ignored when `maxWidth` is set.",
    },
    maxWidth: {
      control: { type: "number", min: 320, max: 1400, step: 40 },
      description: "Custom max-width (px). Overrides `size`.",
    },
    padding: {
      control: { type: "number", min: 0, max: 8, step: 1 },
      description: "Horizontal padding, as a `--space-*` step.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  render: (args) => (
    <Container {...args}>
      <Cell>Centered, max-width content.</Cell>
    </Container>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--space-3)" }}>
      {(["sm", "md", "lg", "xl"] as const).map((size) => (
        <Container key={size} size={size}>
          <Cell>size = {size}</Cell>
        </Container>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: { story: "The four `size` presets, widest last." },
    },
  },
};
