import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "../../src";

const meta: Meta<typeof Text> = {
  title: "Typography/Text",
  component: Text,
  args: { size: "md", children: "The quick brown fox." },
  parameters: {
    docs: {
      description: {
        component:
          "Polymorphic inline/block text on the shared type scale. Supports `weight`, " +
          "`align`, single-line `truncate`, and multi-line `lineClamp`.",
      },
    },
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg", "xl"] },
    weight: { control: "inline-radio", options: ["normal", "bold"] },
    align: { control: "inline-radio", options: ["start", "center", "end"] },
    mono: { control: "boolean" },
    truncate: { control: "boolean" },
    lineClamp: { control: { type: "number", min: 1, max: 5, step: 1 } },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--space-2)" }}>
      <Text size="sm">Small text</Text>
      <Text size="md">Medium text</Text>
      <Text size="lg">Large text</Text>
      <Text size="xl">Extra-large text</Text>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--space-2)" }}>
      <Text weight="bold">Bold text</Text>
      <Text weight="normal">Normal weight</Text>
      <Text mono>Monospace text</Text>
    </div>
  ),
};

export const Truncate: Story = {
  render: () => (
    <div
      style={{
        inlineSize: 220,
        padding: "var(--space-3)",
        border: "var(--border-width) dashed var(--fg)",
      }}
    >
      <Text truncate>
        This is a long single line that gets cut off with an ellipsis.
      </Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "`truncate` ellipsizes one line within a constrained width.",
      },
    },
  },
};

export const LineClamp: Story = {
  render: () => (
    <div
      style={{
        inlineSize: 260,
        padding: "var(--space-3)",
        border: "var(--border-width) dashed var(--fg)",
      }}
    >
      <Text lineClamp={2}>
        This paragraph is clamped to two lines. Any overflow beyond the second
        line is hidden behind a trailing ellipsis so cards stay tidy.
      </Text>
    </div>
  ),
  parameters: {
    docs: {
      description: { story: "`lineClamp={n}` limits multi-line text to n lines." },
    },
  },
};

export const Aligned: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gap: "var(--space-2)",
        inlineSize: 260,
        padding: "var(--space-3)",
        border: "var(--border-width) dashed var(--fg)",
      }}
    >
      <Text as="p" align="start">Start-aligned</Text>
      <Text as="p" align="center">Center-aligned</Text>
      <Text as="p" align="end">End-aligned</Text>
    </div>
  ),
};
