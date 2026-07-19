import React from "react";
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
    description: "Active two-color theme",
    defaultValue: "classic",
    toolbar: {
      title: "Theme",
      icon: "paintbrush",
      dynamicTitle: true,
      items: paletteNames.map((name) => ({
        value: name,
        title: palettes[name].label,
      })),
    },
  },
  direction: {
    description: "Text direction",
    defaultValue: "ltr",
    toolbar: {
      title: "Direction",
      icon: "transfer",
      dynamicTitle: true,
      items: [
        { value: "ltr", title: "LTR" },
        { value: "rtl", title: "RTL" },
      ],
    },
  },
  density: {
    description: "Spacing / sizing density",
    defaultValue: "comfortable",
    toolbar: {
      title: "Density",
      icon: "grow",
      dynamicTitle: true,
      items: [
        { value: "comfortable", title: "Comfortable" },
        { value: "compact", title: "Compact" },
      ],
    },
  },
};

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme as PaletteName;
  const direction = context.globals.direction === "rtl" ? "rtl" : "ltr";
  const density =
    context.globals.density === "compact" ? "compact" : "comfortable";
  // In Docs, stories are embedded previews that should hug their content; only
  // fill the viewport in the standalone canvas view. Overlay-heavy stories can
  // reserve space via a `docsMinHeight` parameter so their panels (portaled or
  // anchored) have room instead of being trapped/overlapping in Docs.
  const isDocs = context.viewMode === "docs";
  const docsMinHeight = context.parameters.docsMinHeight as number | undefined;

  return (
    // Remount when the toolbar changes so the uncontrolled ThemeProvider picks
    // up the new defaults.
    <ThemeProvider
      key={`${theme}-${density}`}
      defaultTheme={theme}
      defaultDensity={density}
    >
      <div
        dir={direction}
        style={{
          padding: "var(--space-5)",
          minHeight: isDocs ? docsMinHeight : "100vh",
        }}
      >
        <Story />
      </div>
    </ThemeProvider>
  );
};

const preview: Preview = {
  tags: ["autodocs"],
  decorators: [withTheme],
  parameters: {
    layout: "fullscreen",
    controls: { expanded: true },
    options: {
      storySort: {
        order: [
          "Introduction",
          "Foundations",
          "Guides",
          "Examples",
          "Layout",
          "Typography",
          "Controls",
          "Forms",
          "Display",
          "Data",
          "Navigation",
          "Disclosure",
          "Overlays",
          "Theming",
        ],
      },
    },
  },
};

export default preview;
