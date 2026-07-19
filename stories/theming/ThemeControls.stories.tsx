import type { Meta, StoryObj } from "@storybook/react";
import { Inline, PaletteSelect } from "../../src";

const meta: Meta = {
  title: "Theming/Controls",
};

export default meta;
type Story = StoryObj;

/**
 * `PaletteSelect` reads/writes the ThemeProvider from the preview decorator, so
 * it changes the live theme alongside the toolbar control.
 */
export const Controls: Story = {
  render: () => (
    <Inline gap={5} align="center">
      <div style={{ minWidth: 200 }}>
        <PaletteSelect />
      </div>
    </Inline>
  ),
};
