import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  AAA_CONTRAST,
  Badge,
  Code,
  Inline,
  Stack,
  Text,
  contrastRatio,
  meetsAAA,
} from "../../src";

/**
 * The whole system is built on a single foreground/background pair that must
 * clear WCAG AAA (>= 7:1). This checker uses the public `contrastRatio` and
 * `meetsAAA` helpers so you can validate a candidate pair before adding it as a
 * named palette.
 */
const meta: Meta = {
  title: "Foundations/Contrast",
  parameters: {
    docs: {
      description: {
        component:
          "Live contrast ratio between a foreground and background color, using the exported `contrastRatio`/`meetsAAA` helpers. Every Duality palette must clear the AAA threshold of 7:1.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function isHex(value: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}

function ContrastCheckerDemo() {
  const [fg, setFg] = useState("#141414");
  const [bg, setBg] = useState("#fcfbff");

  const valid = isHex(fg) && isHex(bg);
  const ratio = valid ? contrastRatio(fg, bg) : null;
  const passes = valid ? meetsAAA(fg, bg) : false;

  return (
    <Stack gap={4} style={{ maxWidth: 460 }}>
      <Inline gap={4}>
        <Stack gap={1}>
          <Text size="sm" weight="bold">
            Foreground
          </Text>
          <Inline gap={2} align="center">
            <input
              type="color"
              aria-label="Foreground color"
              value={isHex(fg) ? fg : "#000000"}
              onChange={(e) => setFg(e.target.value)}
            />
            <input
              aria-label="Foreground hex"
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              style={{ width: 96, fontFamily: "var(--font-mono)" }}
            />
          </Inline>
        </Stack>
        <Stack gap={1}>
          <Text size="sm" weight="bold">
            Background
          </Text>
          <Inline gap={2} align="center">
            <input
              type="color"
              aria-label="Background color"
              value={isHex(bg) ? bg : "#ffffff"}
              onChange={(e) => setBg(e.target.value)}
            />
            <input
              aria-label="Background hex"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              style={{ width: 96, fontFamily: "var(--font-mono)" }}
            />
          </Inline>
        </Stack>
      </Inline>

      <div
        style={{
          padding: "var(--space-5)",
          color: valid ? fg : undefined,
          background: valid ? bg : undefined,
          border: "var(--border-width) solid var(--fg)",
        }}
      >
        <Text as="p" style={{ color: "inherit", margin: 0 }}>
          The quick brown fox jumps over the lazy dog.
        </Text>
      </div>

      <Inline gap={3} align="center">
        <Text weight="bold">
          Ratio:{" "}
          <Code>{ratio != null ? `${ratio.toFixed(2)}:1` : "invalid hex"}</Code>
        </Text>
        {valid && (
          <Badge variant={passes ? "solid" : "outline"}>
            {passes ? "AAA pass" : `Fails (needs ${AAA_CONTRAST}:1)`}
          </Badge>
        )}
      </Inline>
    </Stack>
  );
}

export const Default: Story = {
  render: () => <ContrastCheckerDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Edit either color to see the ratio update. The badge flips to a filled AAA pass once the pair clears 7:1.",
      },
    },
  },
};
