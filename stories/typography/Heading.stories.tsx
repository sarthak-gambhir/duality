import type { Meta, StoryObj } from "@storybook/react";
import { Heading, type HeadingLevel } from "../../src";

const meta: Meta<typeof Heading> = {
  title: "Typography/Heading",
  component: Heading,
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
