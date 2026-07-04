import type { Decorator, Preview } from "@storybook/react";
import {
  ThemeProvider,
  paletteNames,
  palettes,
  type PaletteName,
} from "../src";
import "../src/index.scss";

export const globalTypes = {
  theme: {
    description: "Active two-color palette",
    defaultValue: "classic",
    toolbar: {
      title: "Palette",
      icon: "paintbrush",
      dynamicTitle: true,
      items: paletteNames.map((name) => ({
        value: name,
        title: palettes[name].label,
      })),
    },
  },
  inverted: {
    description: "Swap the two colors",
    defaultValue: "false",
    toolbar: {
      title: "Invert",
      icon: "contrast",
      dynamicTitle: true,
      items: [
        { value: "false", title: "Normal" },
        { value: "true", title: "Inverted" },
      ],
    },
  },
};

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme as PaletteName;
  const inverted = context.globals.inverted === "true";

  return (
    // Remount when the toolbar changes so the uncontrolled ThemeProvider picks
    // up the new defaults.
    <ThemeProvider
      key={`${theme}-${inverted}`}
      defaultTheme={theme}
      defaultInverted={inverted}
    >
      <div style={{ padding: "var(--space-5)", minHeight: "100vh" }}>
        <Story />
      </div>
    </ThemeProvider>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  parameters: {
    layout: "fullscreen",
    controls: { expanded: true },
  },
};

export default preview;
