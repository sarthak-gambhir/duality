import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "../../src";

const meta: Meta<typeof Box> = {
  title: "Layout/Box",
  component: Box,
};

export default meta;
type Story = StoryObj;

export const AsDiv: Story = {
  render: () => (
    <Box
      style={{
        border: "var(--border-width) solid var(--fg)",
        padding: "var(--space-4)",
      }}
    >
      A plain Box (renders a div).
    </Box>
  ),
};

export const AsSection: Story = {
  render: () => (
    <Box
      as="section"
      aria-label="example"
      style={{ padding: "var(--space-4)" }}
    >
      Box rendered as a semantic &lt;section&gt; via the `as` prop.
    </Box>
  ),
};
