import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import {
  Badge,
  Button,
  Checkbox,
  Inline,
  Input,
  Stack,
  Text,
} from "../../src";

/**
 * Density is purely dimensional. The `comfortable` and `compact` scales
 * re-declare the spacing and sizing tokens, so paddings, gaps, and control
 * heights rescale - but the two colors, border widths, type scale, and icon
 * sizes stay identical. Type and icons are intentionally density-independent so
 * text legibility and glyph recognizability never regress in dense layouts.
 */
const meta: Meta = {
  title: "Foundations/Density",
  parameters: {
    docs: {
      description: {
        component:
          "Side-by-side comparison of the same components under comfortable vs compact density. Only dimensions change; `--font-size-*` and `--icon-*` are held constant by design.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function Sample(): ReactNode {
  return (
    <Stack gap={3} style={{ minWidth: 220 }}>
      <Inline gap={2} align="center">
        <Button>Primary</Button>
        <Button variant="ghost">Ghost</Button>
      </Inline>
      <Input placeholder="Email address" />
      <Inline gap={2} align="center">
        <Badge>New</Badge>
        <Badge variant="outline">Draft</Badge>
      </Inline>
      <Checkbox label="Subscribe to updates" defaultChecked />
    </Stack>
  );
}

function DensityColumn({
  density,
  title,
}: {
  density: "comfortable" | "compact";
  title: string;
}): ReactNode {
  return (
    <div data-density={density} style={{ flex: "0 0 auto" }}>
      <Stack gap={3}>
        <Text weight="bold">{title}</Text>
        <div
          style={{
            padding: "var(--space-4)",
            border: "var(--border-width) solid var(--fg)",
          }}
        >
          <Sample />
        </div>
      </Stack>
    </div>
  );
}

/**
 * Two nested `[data-density]` roots render the identical component tree so the
 * spacing rescale is directly comparable.
 */
export const Default: Story = {
  render: () => (
    <Inline gap={6} align="start">
      <DensityColumn density="comfortable" title="Comfortable" />
      <DensityColumn density="compact" title="Compact" />
    </Inline>
  ),
};
