import type { Meta, StoryObj } from "@storybook/react";
import { Container } from "../../src";
import { Cell } from "./_demo";

const meta: Meta<typeof Container> = {
  title: "Layout/Container",
  component: Container,
  args: { maxWidth: 640 },
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  render: (args) => (
    <Container {...args}>
      <Cell>Centered, max-width content.</Cell>
    </Container>
  ),
};
