import type { Meta, StoryObj } from "@storybook/react";
import { Accordion, AccordionItem, Text } from "../../src";

const meta: Meta<typeof Accordion> = {
  title: "Disclosure/Accordion",
  component: Accordion,
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Single: Story = {
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
