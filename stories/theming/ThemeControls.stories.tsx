import type { Meta, StoryObj } from "@storybook/react";
import { DensitySelect, Inline, PaletteSelect, Stack, Text } from "../../src";

const meta: Meta = {
  title: "Theming/Controls",
  parameters: {
    docs: {
      description: {
        component:
          "Ready-made `Select` controls bound to the ThemeProvider. `PaletteSelect` switches the active two-color theme; `DensitySelect` switches the comfortable/compact spacing scale. Both read and write the same provider the preview decorator mounts, so they stay in sync with the toolbar globals.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/**
 * `PaletteSelect` reads/writes the ThemeProvider from the preview decorator, so
 * it changes the live theme alongside the toolbar control.
 */
export const Palette: Story = {
  render: () => (
    <Inline gap={5} align="center">
      <div style={{ minWidth: 200 }}>
        <PaletteSelect />
      </div>
    </Inline>
  ),
};

/**
 * `DensitySelect` switches between the comfortable and compact spacing scales.
 * The colors and border widths are unchanged - only dimensions rescale.
 */
export const DensityControl: Story = {
  render: () => (
    <Inline gap={5} align="center">
      <div style={{ minWidth: 200 }}>
        <DensitySelect />
      </div>
    </Inline>
  ),
};

/** Both controls side by side, as they would appear in a settings panel. */
export const PaletteAndDensity: Story = {
  render: () => (
    <Stack gap={3} style={{ maxWidth: 240 }}>
      <Stack gap={1}>
        <Text size="sm" weight="bold">
          Palette
        </Text>
        <PaletteSelect />
      </Stack>
      <Stack gap={1}>
        <Text size="sm" weight="bold">
          Density
        </Text>
        <DensitySelect />
      </Stack>
    </Stack>
  ),
};
