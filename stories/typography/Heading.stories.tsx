import type { Meta, StoryObj } from "@storybook/react";
import { Heading, type HeadingLevel } from "../../src";

const meta: Meta<typeof Heading> = {
  title: "Typography/Heading",
  component: Heading,
  parameters: {
    docs: {
      description: {
        component:
          "Section heading on a stepped scale. `level` sets the semantic `h1`-`h6` tag; " +
          "`visualLevel` styles it as a different level without changing the tag, so document " +
          "outline and visual hierarchy can diverge when needed.",
      },
    },
  },
  argTypes: {
    level: {
      control: { type: "number", min: 1, max: 6, step: 1 },
      description: "Semantic level; sets the rendered element.",
    },
    visualLevel: {
      control: { type: "number", min: 1, max: 6, step: 1 },
      description: "Visual size; defaults to `level`.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const AllLevels: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--space-3)" }}>
      {([1, 2, 3, 4, 5, 6] as HeadingLevel[]).map((level) => (
        <Heading key={level} level={level}>
          Heading level {level}
        </Heading>
      ))}
    </div>
  ),
};

export const VisualLevel: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--space-3)" }}>
      <Heading level={2} visualLevel={4}>
        An h2 styled as level 4
      </Heading>
      <Heading level={3} visualLevel={1}>
        An h3 styled as level 1
      </Heading>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Keep the correct semantic `level` for accessibility while tuning the visual size.",
      },
    },
  },
};
