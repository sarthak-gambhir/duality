import type { Meta, StoryObj } from "@storybook/react";
import { Link, Text } from "../../src";

const meta: Meta<typeof Link> = {
  title: "Typography/Link",
  component: Link,
  args: { children: "A duality link", href: "#" },
  parameters: {
    docs: {
      description: {
        component:
          "Text link: underlined by default, inverts on hover. `external` opens in a new tab " +
          "with a safe `rel` and a trailing glyph; `underline` tunes the underline policy.",
      },
    },
  },
  argTypes: {
    external: { control: "boolean" },
    underline: {
      control: "inline-radio",
      options: ["always", "hover", "none"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {};

export const External: Story = {
  args: {
    external: true,
    href: "https://example.com",
    children: "Visit example.com",
  },
  parameters: {
    docs: {
      description: {
        story:
          '`external` adds `target="_blank"`, `rel="noopener noreferrer"`, and the glyph.',
      },
    },
  },
};

export const UnderlineOptions: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--space-2)" }}>
      <Link href="#" underline="always">
        Always underlined
      </Link>
      <Link href="#" underline="hover">
        Underlined on hover
      </Link>
      <Link href="#" underline="none">
        Never underlined
      </Link>
    </div>
  ),
};

export const InText: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gap: "var(--space-4)",
        inlineSize: 480,
      }}
    >
      <Text as="p">
        Duality ships as an{" "}
        <Link href="#" underline="always">
          internal link
        </Link>{" "}
        that flows and wraps naturally in prose, while an{" "}
        <Link href="https://example.com" external>
          external reference
        </Link>{" "}
        keeps its glyph pinned to the label. Read the full{" "}
        <Link href="https://example.com/getting-started" external>
          getting started guide
        </Link>{" "}
        for details.
      </Text>
      <Text as="p" size="sm">
        Internal links break mid-phrase across lines like normal text; external
        links stay on one line as a single unit so the trailing icon never
        orphans.
      </Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Links inline within a paragraph. Narrow the container to see internal links " +
          "wrap mid-phrase while external links (label + glyph) move as one unit.",
      },
    },
  },
};
