import type { Meta, StoryObj } from "@storybook/react";
import { Stack, Text, type StackProps } from "../../src";
import { Cell } from "./_demo";

const meta: Meta<typeof Stack> = {
  title: "Layout/Stack",
  component: Stack,
  args: { gap: 4 },
  parameters: {
    docs: {
      description: {
        component:
          "Vertical flex layout with token-based spacing. Polymorphic via `as`. " +
          "Supports cross-axis `align`, main-axis `justify`, and `wrap`.",
      },
    },
  },
  argTypes: {
    gap: { control: { type: "number", min: 0, max: 8, step: 1 } },
    align: {
      control: "inline-radio",
      options: ["start", "center", "end", "stretch"],
    },
    justify: {
      control: "inline-radio",
      options: ["start", "center", "end", "between", "around", "evenly"],
    },
    wrap: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Stack>;

export const Default: Story = {
  render: (args) => (
    <Stack {...args}>
      <Cell>One</Cell>
      <Cell>Two</Cell>
      <Cell>Three</Cell>
    </Stack>
  ),
};

const ALIGN_VALUES: NonNullable<StackProps["align"]>[] = [
  "start",
  "center",
  "end",
  "stretch",
];

export const Aligned: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${ALIGN_VALUES.length}, 1fr)`,
        gap: "var(--space-4)",
        alignItems: "start",
      }}
    >
      {ALIGN_VALUES.map((align) => (
        <div key={align} style={{ display: "grid", gap: "var(--space-2)" }}>
          <Text size="sm" weight="bold" align="center">
            {align}
          </Text>
          {/* `align` is the cross (horizontal) axis for a column Stack. A fixed
              width wider than the items makes start/center/end/stretch clear. */}
          <Stack
            gap={2}
            align={align}
            style={{
              inlineSize: 160,
              padding: "var(--space-2)",
              border: "var(--border-width) dashed var(--fg)",
            }}
          >
            <Cell>One</Cell>
            <Cell>Two</Cell>
            <Cell>Three</Cell>
          </Stack>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`align` controls the cross (horizontal) axis of a column Stack: start/center/end " +
          "position items within the fixed width, while stretch makes them fill it.",
      },
    },
  },
};

const JUSTIFY_VALUES: NonNullable<StackProps["justify"]>[] = [
  "start",
  "center",
  "end",
  "between",
  "around",
  "evenly",
];

export const Justified: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${JUSTIFY_VALUES.length}, 1fr)`,
        gap: "var(--space-4)",
        alignItems: "start",
      }}
    >
      {JUSTIFY_VALUES.map((justify) => (
        <div key={justify} style={{ display: "grid", gap: "var(--space-2)" }}>
          <Text size="sm" weight="bold" align="center">
            {justify}
          </Text>
          {/* Fixed height + dashed border makes the extra vertical space (and
              thus each justify value's distribution) visible. */}
          <Stack
            gap={2}
            justify={justify}
            style={{
              blockSize: 260,
              padding: "var(--space-2)",
              border: "var(--border-width) dashed var(--fg)",
            }}
          >
            <Cell>One</Cell>
            <Cell>Two</Cell>
            <Cell>Three</Cell>
          </Stack>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The same three items in six fixed-height Stacks, one per `justify` value. " +
          "`justify` only distributes children along the main (vertical) axis when the " +
          "Stack is taller than its content, which the fixed height and dashed border make clear.",
      },
    },
  },
};
