import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Accordion, AccordionItem, Stack, Text } from "../../src";

/**
 * Vertically stacked disclosure sections following the WAI-ARIA accordion
 * pattern. Triggers support roving keyboard navigation: ArrowUp/ArrowDown move
 * between headers and Home/End jump to the first/last. `single` mode keeps one
 * item open (set `collapsible={false}` to always keep one open); `multiple`
 * allows any number.
 */
const meta: Meta<typeof Accordion> = {
  title: "Disclosure/Accordion",
  component: Accordion,
  argTypes: {
    type: {
      control: "inline-radio",
      options: ["single", "multiple"],
      description: "Whether one or many items can be open at once.",
    },
    collapsible: {
      control: "boolean",
      description:
        "In single mode, whether the open item can be closed by re-clicking it.",
    },
    headingLevel: {
      control: { type: "number", min: 1, max: 6 },
      description: "Heading element level (h1-h6) wrapping each trigger.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: () => (
    <Accordion type="single" defaultValue="a">
      <AccordionItem value="a" title="What is Duality?">
        <Text>A strict two-color design system.</Text>
      </AccordionItem>
      <AccordionItem value="b" title="How are states shown?">
        <Text>
          Via inversion, dither, and border-style changes - never color alone.
        </Text>
      </AccordionItem>
      <AccordionItem value="c" title="Is it accessible?">
        <Text>Palettes meet WCAG AAA contrast.</Text>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={["a", "b"]}>
      <AccordionItem value="a" title="First">
        <Text>Open by default.</Text>
      </AccordionItem>
      <AccordionItem value="b" title="Second">
        <Text>Also open; multiple can stay open at once.</Text>
      </AccordionItem>
    </Accordion>
  ),
};

function ControlledAccordion() {
  const [value, setValue] = useState<string | string[]>("a");
  return (
    <Stack gap={3}>
      <Text size="sm">
        Open: <strong>{String(value) || "(none)"}</strong>
      </Text>
      <Accordion
        type="single"
        value={value}
        onValueChange={setValue}
      >
        <AccordionItem value="a" title="First">
          <Text>Controlled open state.</Text>
        </AccordionItem>
        <AccordionItem value="b" title="Second">
          <Text>Toggling reports through onValueChange.</Text>
        </AccordionItem>
        <AccordionItem value="c" title="Third">
          <Text>Only one open at a time.</Text>
        </AccordionItem>
      </Accordion>
    </Stack>
  );
}

/** Controlled `value`/`onValueChange` in single mode. */
export const Controlled: Story = {
  render: () => <ControlledAccordion />,
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [value, setValue] = useState<string | string[]>("a");
  return (
    <Accordion type="single" value={value} onValueChange={setValue}>
      <AccordionItem value="a" title="First">First panel</AccordionItem>
      <AccordionItem value="b" title="Second">Second panel</AccordionItem>
      <AccordionItem value="c" title="Third">Third panel</AccordionItem>
    </Accordion>
  );
}`,
      },
    },
  },
};

/**
 * `collapsible={false}` keeps exactly one item open - re-clicking the open
 * header does nothing.
 */
export const NonCollapsible: Story = {
  render: () => (
    <Accordion type="single" defaultValue="a" collapsible={false}>
      <AccordionItem value="a" title="Always one open">
        <Text>Clicking this header again will not close it.</Text>
      </AccordionItem>
      <AccordionItem value="b" title="Second">
        <Text>Opening me closes the other.</Text>
      </AccordionItem>
    </Accordion>
  ),
};

/** A disabled item cannot be toggled and is skipped by keyboard navigation. */
export const WithDisabledItem: Story = {
  render: () => (
    <Accordion type="single" defaultValue="a">
      <AccordionItem value="a" title="Enabled">
        <Text>First section.</Text>
      </AccordionItem>
      <AccordionItem value="b" title="Disabled" disabled>
        <Text>You should not see this.</Text>
      </AccordionItem>
      <AccordionItem value="c" title="Also enabled">
        <Text>Third section.</Text>
      </AccordionItem>
    </Accordion>
  ),
};

/** `headingLevel` sets the heading element wrapping each trigger (default 3). */
export const HeadingLevel: Story = {
  render: () => (
    <Accordion type="single" defaultValue="a" headingLevel={2}>
      <AccordionItem value="a" title="Wrapped in an h2">
        <Text>Set headingLevel to fit the surrounding document outline.</Text>
      </AccordionItem>
      <AccordionItem value="b" title="Also an h2">
        <Text>Every trigger uses the same level.</Text>
      </AccordionItem>
    </Accordion>
  ),
};
