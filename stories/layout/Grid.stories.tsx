import type { Meta, StoryObj } from "@storybook/react";
import { Grid } from "../../src";
import { Cell } from "./_demo";

const meta: Meta<typeof Grid> = {
  title: "Layout/Grid",
  component: Grid,
  args: { columns: 3, gap: 4 },
};

export default meta;
type Story = StoryObj<typeof Grid>;

export const Default: Story = {
  render: (args) => (
    <Grid {...args}>
      {Array.from({ length: 6 }, (_, i) => (
        <Cell key={i}>Cell {i + 1}</Cell>
      ))}
    </Grid>
  ),
};
