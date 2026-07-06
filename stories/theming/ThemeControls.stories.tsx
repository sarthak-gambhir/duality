import type { Meta, StoryObj } from "@storybook/react";
import { Inline, PaletteSelect, ThemeToggle } from "../../src";

const meta: Meta = {
  title: "Theming/Controls",
};

export default meta;
type Story = StoryObj;

/**
 * These read/write the ThemeProvider from the preview decorator, so they change
 * the live theme alongside the toolbar controls.
 */
export const Controls: Story = {
  render: () => (
    <Inline gap={5} align="center">
      <div style={{ minWidth: 200 }}>
        <PaletteSelect />
      </div>
      <ThemeToggle />
    </Inline>
  ),
};
