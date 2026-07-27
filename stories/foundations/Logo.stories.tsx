import type { Meta, StoryObj } from "@storybook/react";
import { Logo, Stack, Text } from "../../src";

/**
 * `Logo` is the Duality brand mark: a two-tone circular glyph whose disk and
 * inner cut map to `--fg` / `--bg`. It inverts with the active theme (try the
 * theme toolbar), so it always reads on the base surface. It is decorative by
 * default; pass `label` to expose an accessible name.
 *
 * Because it draws from `--fg` / `--bg` directly (not `currentColor`), place it
 * on a base surface. On an explicitly inverted surface it would blend, so use
 * it for brand lockups (headers, footers) rather than inside inverted chrome.
 */
const meta: Meta<typeof Logo> = {
  title: "Foundations/Logo",
  component: Logo,
  argTypes: {
    size: {
      control: false,
      description:
        "Mark size. A number is px; a string passes through. Defaults to `1em` so it scales with the surrounding font size.",
    },
    label: {
      control: "text",
      description:
        "Accessible name. When set the mark is `role=\"img\"`; otherwise it is decorative and hidden from assistive tech.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const Default: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <Logo size={16} />
      <Logo size={24} />
      <Logo size={48} />
      <Logo size={96} />
    </div>
  ),
};

export const ScalesWithText: Story = {
  render: () => (
    <Stack gap={3}>
      {["sm", "md", "lg"].map((size) => (
        <Text key={size} size={size as "sm" | "md" | "lg"}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Logo />
            Duality
          </span>
        </Text>
      ))}
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "With the default `size=\"1em\"`, the mark tracks the surrounding font size, making it easy to pair with a wordmark inline.",
      },
    },
  },
};

export const BrandLockup: Story = {
  render: () => (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <Logo size={28} label="Duality" />
      <Text weight="bold" size="lg">
        Duality
      </Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A brand lockup: the labelled mark plus the wordmark. Switch the theme in the toolbar to see the mark invert with the surface.",
      },
    },
  },
};
