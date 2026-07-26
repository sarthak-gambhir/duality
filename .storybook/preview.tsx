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
  texture: {
    description: "Texture fill for disabled and decorative surfaces",
    defaultValue: "dither",
    toolbar: {
      title: "Texture",
      icon: "photo",
      dynamicTitle: true,
      items: [
        { value: "dither", title: "Dither" },
        { value: "hatch", title: "Hatch" },
      ],
    },
  },
};

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme as PaletteName;
  const direction = context.globals.direction === "rtl" ? "rtl" : "ltr";
  const density =
    context.globals.density === "compact" ? "compact" : "comfortable";
  const texture = context.globals.texture === "hatch" ? "hatch" : "dither";
  // In Docs, stories are embedded previews that should hug their content; only
  // fill the viewport in the standalone canvas view. Overlay-heavy stories can
  // reserve space via a `docsMinHeight` parameter so their panels (portaled or
  // anchored) have room instead of being trapped/overlapping in Docs.
  const isDocs = context.viewMode === "docs";
  const docsMinHeight = context.parameters.docsMinHeight as number | undefined;
  // Height a "fill the story" child (e.g. a full-height Sidebar rail) should
  // take: the viewport in canvas, but only the reserved docs block in Docs, so
  // it doesn't blow the embedded preview up to a full screen each.
  const fillHeight = isDocs
    ? docsMinHeight
      ? `calc(${docsMinHeight}px - 2 * var(--space-5))`
      : undefined
    : "calc(100vh - 2 * var(--space-5))";

  const wrapperStyle = {
    padding: "var(--space-5)",
    minHeight: isDocs ? docsMinHeight : "100vh",
  } as React.CSSProperties & Record<string, string | number | undefined>;
  if (fillHeight) wrapperStyle["--du-story-fill"] = fillHeight;

  return (
    // Remount when the toolbar changes so the uncontrolled ThemeProvider picks
    // up the new defaults.
    <ThemeProvider
      key={`${theme}-${density}-${texture}`}
      defaultTheme={theme}
      defaultDensity={density}
      defaultTexture={texture}
    >
      <div dir={direction} style={wrapperStyle}>
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
