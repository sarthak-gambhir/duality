import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  RiCheckDoubleLine,
  RiCloseCircleLine,
  RiHeartLine,
  RiStarLine,
} from "react-icons/ri";
import {
  Badge,
  Button,
  Checkbox,
  Icon,
  IconsProvider,
  Select,
  Stack,
} from "../../src";

/**
 * `Icon` is a thin two-color wrapper around `react-icons`. Icons render with
 * `fill: currentColor`, so they inherit `--fg`/`--bg` and invert with their
 * surface automatically. Pass `label` to expose an accessible name, otherwise
 * the icon is decorative and hidden from assistive tech.
 *
 * Every built-in glyph (carets, checks, close buttons, sort arrows, status
 * markers, ...) is drawn from a semantic registry. Wrap any subtree in
 * `IconsProvider` to re-skin those glyphs globally.
 */
const meta: Meta<typeof Icon> = {
  title: "Foundations/Icon",
  component: Icon,
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Basic: Story = {
  render: () => (
    <Stack gap={4}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Icon icon={RiStarLine} size={16} />
        <Icon icon={RiStarLine} size={24} />
        <Icon icon={RiStarLine} size={32} />
        <Icon icon={RiStarLine} size={48} />
      </div>
      <p style={{ fontFamily: "var(--font-sans)" }}>
        Inline with text <Icon icon={RiHeartLine} /> at <code>1em</code>.
      </p>
    </Stack>
  ),
};

export const Accessible: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      {/* Named: announced as an image with a label. */}
      <Icon icon={RiHeartLine} label="Favorite" size={28} />
      {/* Decorative: hidden from assistive tech. */}
      <Icon icon={RiStarLine} size={28} />
    </div>
  ),
};

/**
 * `IconsProvider` overrides the semantic registry for everything inside it.
 * Here the `check` and `close` glyphs are swapped, which re-skins the built-in
 * marks in `Checkbox`, `Badge`, `Select`, and every other component at once.
 */
export const RegistryOverride: Story = {
  render: () => {
    function Demo() {
      const [checked, setChecked] = useState(true);
      const [removed, setRemoved] = useState(false);
      return (
        <Stack gap={4}>
          <Checkbox
            label="Custom check mark"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          {removed ? (
            <Button size="sm" onClick={() => setRemoved(false)}>
              Restore badge
            </Button>
          ) : (
            <Badge onRemove={() => setRemoved(true)}>Removable</Badge>
          )}
          <div style={{ maxWidth: 240 }}>
            <Select
              aria-label="Fruit"
              defaultValue="apple"
              options={[
                { value: "apple", label: "Apple" },
                { value: "pear", label: "Pear" },
              ]}
            />
          </div>
        </Stack>
      );
    }
    return (
      <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
        <div>
          <p style={{ fontFamily: "var(--font-sans)" }}>Default icons</p>
          <Demo />
        </div>
        <IconsProvider
          icons={{ check: RiCheckDoubleLine, close: RiCloseCircleLine }}
        >
          <div>
            <p style={{ fontFamily: "var(--font-sans)" }}>Overridden icons</p>
            <Demo />
          </div>
        </IconsProvider>
      </div>
    );
  },
};
