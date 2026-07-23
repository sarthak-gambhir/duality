import type { Meta, StoryObj } from "@storybook/react";
import { Inline, Text, type InlineProps } from "../../src";
import { Cell } from "./_demo";

const meta: Meta<typeof Inline> = {
  title: "Layout/Inline",
  component: Inline,
  args: { gap: 3, align: "center", wrap: true },
  parameters: {
    docs: {
      description: {
        component:
          "Horizontal flex layout with token-based spacing and optional wrapping. " +
          "Polymorphic via `as`. `justify` now includes `around` and `evenly`.",
      },
    },
  },
  argTypes: {
    gap: { control: { type: "number", min: 0, max: 8, step: 1 } },
    align: {
      control: "inline-radio",
      options: ["start", "center", "end", "stretch", "baseline"],
    },
    justify: {
      control: "inline-radio",
      options: ["start", "center", "end", "between", "around", "evenly"],
    },
    wrap: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Inline>;

export const Default: Story = {
  render: (args) => (
    <Inline {...args}>
      <Cell>One</Cell>
      <Cell>Two</Cell>
      <Cell>Three</Cell>
      <Cell>Four</Cell>
    </Inline>
  ),
};

const ALIGN_VALUES: NonNullable<InlineProps["align"]>[] = [
  "start",
  "center",
  "end",
  "stretch",
  "baseline",
];

const JUSTIFY_VALUES: NonNullable<InlineProps["justify"]>[] = [
  "start",
  "center",
  "end",
  "between",
  "around",
  "evenly",
];

// Rows of a labeled value + its demo container.
function Rows({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gap: "var(--space-3)" }}>{children}</div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "72px 1fr",
        gap: "var(--space-3)",
        alignItems: "center",
      }}
    >
      <Text size="sm" weight="bold">
        {label}
      </Text>
      {children}
    </div>
  );
}

export const Aligned: Story = {
  render: () => (
    <Rows>
      {ALIGN_VALUES.map((align) => (
        <Row key={align} label={align}>
          {/* `align` is the cross (vertical) axis. Items of different heights
              make start/center/end/stretch/baseline visible. */}
          <Inline
            align={align}
            style={{
              blockSize: 96,
              padding: "var(--space-2)",
              border: "var(--border-width) dashed var(--fg)",
            }}
          >
            <Cell>
              <Text size="sm">Small</Text>
            </Cell>
            <Cell>
              <Text size="lg">Large</Text>
            </Cell>
            <Cell>
              <Text size="xl">Extra</Text>
            </Cell>
          </Inline>
        </Row>
      ))}
    </Rows>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`align` controls the cross (vertical) axis. With items of differing heights, " +
          "start/center/end position them, stretch equalizes heights, and baseline lines up " +
          "their text baselines.",
      },
    },
  },
};

export const Justified: Story = {
  render: () => (
    <Rows>
      {JUSTIFY_VALUES.map((justify) => (
        <Row key={justify} label={justify}>
          {/* `justify` is the main (horizontal) axis: it distributes the free
              space once the row is wider than its items. */}
          <Inline
            justify={justify}
            wrap={false}
            style={{
              padding: "var(--space-2)",
              border: "var(--border-width) dashed var(--fg)",
            }}
          >
            <Cell>One</Cell>
            <Cell>Two</Cell>
            <Cell>Three</Cell>
          </Inline>
        </Row>
      ))}
    </Rows>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`justify` distributes free space along the main (horizontal) axis: start/center/end " +
          "pack the items, while between/around/evenly spread them apart.",
      },
    },
  },
};

export const NoWrap: Story = {
  args: { wrap: false },
  render: (args) => (
    <Inline {...args} style={{ inlineSize: 260, overflow: "auto" }}>
      {Array.from({ length: 8 }, (_, i) => (
        <Cell key={i}>Item {i + 1}</Cell>
      ))}
    </Inline>
  ),
  parameters: {
    docs: {
      description: {
        story: "`wrap={false}` keeps items on one line (overflow scrolls).",
      },
    },
  },
};
