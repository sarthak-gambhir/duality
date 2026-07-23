import type { Meta, StoryObj } from "@storybook/react";
import { TruncatedText } from "../../src";

const meta: Meta<typeof TruncatedText> = {
  title: "Typography/TruncatedText",
  component: TruncatedText,
  parameters: {
    docs: {
      description: {
        component:
          "Text that truncates (single line) or clamps (multi line) and reveals the full " +
          "value in a tooltip only when it is actually clipped. The complete text always " +
          "stays in the DOM, so assistive tech reads it regardless of what is visible.",
      },
    },
  },
  argTypes: {
    lines: {
      control: { type: "number", min: 1, max: 5, step: 1 },
      description: "Lines before clipping. 1 = ellipsis; >1 = clamp.",
    },
    tooltipPlacement: {
      control: "inline-radio",
      options: ["top", "bottom", "left", "right"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof TruncatedText>;

const box = {
  inlineSize: 220,
  padding: "var(--space-3)",
  border: "var(--border-width) dashed var(--fg)",
};

export const SingleLine: Story = {
  render: () => (
    <div style={box}>
      <TruncatedText>
        This is a long single line that gets cut off, so hover to see the rest.
      </TruncatedText>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Hover the clipped text to reveal the full value in a tooltip.",
      },
    },
  },
};

export const MultiLine: Story = {
  render: () => (
    <div style={{ ...box, inlineSize: 260 }}>
      <TruncatedText lines={2}>
        This paragraph is clamped to two lines. Any overflow beyond the second
        line is hidden, and the whole thing shows up in the tooltip on hover.
      </TruncatedText>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "`lines={n}` clamps to n lines; the tooltip wraps the full text.",
      },
    },
  },
};

export const NoTooltipWhenShort: Story = {
  render: () => (
    <div style={{ ...box, inlineSize: 320 }}>
      <TruncatedText>Short label</TruncatedText>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "When the text fits, no tooltip is attached — nothing to reveal.",
      },
    },
  },
};
