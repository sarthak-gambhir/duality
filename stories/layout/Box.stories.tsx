import type { Meta, StoryObj } from "@storybook/react";
import { Box, Heading, Link, Stack, Text } from "../../src";

const meta: Meta<typeof Box> = {
  title: "Layout/Box",
  component: Box,
  parameters: {
    docs: {
      description: {
        component:
          "Polymorphic base element. Renders a `div` by default; set `as` for any element. " +
          "Optional token-driven `padding`/`paddingX`/`paddingY`, `border`, and `radius` props " +
          "cover the common wrapper needs without inline styles. `children` accepts any React " +
          "node — plain text or arbitrary JSX.",
      },
    },
  },
  argTypes: {
    padding: {
      control: { type: "number", min: 0, max: 8, step: 1 },
      description: "Padding on all sides, as a `--space-*` step.",
    },
    paddingX: {
      control: { type: "number", min: 0, max: 8, step: 1 },
      description: "Inline-axis padding; overrides `padding` horizontally.",
    },
    paddingY: {
      control: { type: "number", min: 0, max: 8, step: 1 },
      description: "Block-axis padding; overrides `padding` vertically.",
    },
    border: { control: "boolean", description: "Draw a foreground border." },
    radius: { control: "boolean", description: "Apply the token radius." },
  },
};

export default meta;
type Story = StoryObj<typeof Box>;

export const Default: Story = {
  args: { padding: 4, border: true, children: "A Box with token padding + border." },
};

export const AsSection: Story = {
  args: {
    as: "section",
    "aria-label": "example",
    padding: 4,
    border: true,
    children: "Box rendered as a semantic <section> via the `as` prop.",
  },
  parameters: {
    docs: {
      description: {
        story: "`as` swaps the element while keeping the token-driven styling.",
      },
    },
  },
};

export const PaddingAxes: Story = {
  render: () => (
    <Box paddingX={6} paddingY={2} border>
      Wide inline padding, tight block padding.
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: "`paddingX` / `paddingY` override `padding` per axis.",
      },
    },
  },
};

export const WithJsxChildren: Story = {
  render: () => (
    <Box padding={4} border style={{ inlineSize: 360 }}>
      <Stack gap={2}>
        <Heading level={3} visualLevel={4}>
          Card title
        </Heading>
        <Text as="p">
          Box children can be arbitrary JSX — headings, paragraphs, even a{" "}
          <Link href="#" underline="hover">
            link
          </Link>
          .
        </Text>
      </Stack>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`children` is a standard `ReactNode`, so any JSX composes inside a Box.",
      },
    },
  },
};
