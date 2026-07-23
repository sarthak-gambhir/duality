import type { Meta, StoryObj } from "@storybook/react";
import { Grid } from "../../src";
import { Cell } from "./_demo";

const meta: Meta<typeof Grid> = {
  title: "Layout/Grid",
  component: Grid,
  args: { columns: 3, gap: 4 },
  parameters: {
    docs: {
      description: {
        component:
          "CSS grid with token-based gaps. Use fixed equal `columns`, or set " +
          "`minChildWidth` for a responsive auto-fit track that needs no breakpoints.",
      },
    },
  },
  argTypes: {
    columns: { control: { type: "number", min: 1, max: 6, step: 1 } },
    minChildWidth: {
      control: { type: "number", min: 80, max: 400, step: 20 },
      description: "Auto-fit min column width (px). Overrides `columns`.",
    },
    gap: { control: { type: "number", min: 0, max: 8, step: 1 } },
    align: {
      control: "inline-radio",
      options: [undefined, "start", "center", "end", "stretch"],
    },
    justify: {
      control: "inline-radio",
      options: [undefined, "start", "center", "end", "stretch"],
    },
  },
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

export const AutoFit: Story = {
  args: { minChildWidth: 160 },
  render: (args) => (
    <Grid {...args}>
      {Array.from({ length: 6 }, (_, i) => (
        <Cell key={i}>Cell {i + 1}</Cell>
      ))}
    </Grid>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`minChildWidth` packs as many columns as fit; resize the canvas to see it reflow.",
      },
    },
  },
};
