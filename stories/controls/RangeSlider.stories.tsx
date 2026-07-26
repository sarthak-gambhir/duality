import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RangeSlider, Stack, Text } from "../../src";

const meta: Meta<typeof RangeSlider> = {
  title: "Controls/RangeSlider",
  component: RangeSlider,
  args: { min: 0, max: 100, step: 1 },
  argTypes: {
    invalid: { control: "boolean", description: "Marks the control invalid." },
    disabled: { control: "boolean", description: "Disables the control." },
    showValues: {
      control: "boolean",
      description: "Show a value label above each thumb.",
    },
    showLimits: {
      control: "boolean",
      description: "Show the min/max bounds under the track ends.",
    },
    minStepsBetweenThumbs: {
      control: "number",
      description: "Minimum steps that must remain between the two thumbs.",
    },
    min: { control: "number", description: "Minimum value." },
    max: { control: "number", description: "Maximum value." },
    step: { control: "number", description: "Step increment." },
  },
};

export default meta;
type Story = StoryObj<typeof RangeSlider>;

export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <RangeSlider {...args} defaultValue={[20, 80]} showValues />
    </div>
  ),
};

function Controlled() {
  const [value, setValue] = useState<[number, number]>([20, 80]);
  return (
    <Stack gap={3} style={{ maxWidth: 320 }}>
      <RangeSlider value={value} onValueChange={setValue} />
      <Text size="sm">
        {value[0]} - {value[1]}
      </Text>
    </Stack>
  );
}

/** Controlled `value` + `onValueChange`, echoing the current range. */
export const ControlledValue: Story = {
  name: "Controlled",
  render: () => <Controlled />,
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [value, setValue] = useState<[number, number]>([20, 80]);
  return (
    <Stack gap={3}>
      <RangeSlider value={value} onValueChange={setValue} />
      <Text size="sm">{value[0]} - {value[1]}</Text>
    </Stack>
  );
}`,
      },
    },
  },
};

export const WithValues: Story = {
  name: "Value labels",
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <RangeSlider defaultValue={[30, 70]} showValues />
    </div>
  ),
};

export const WithLimits: Story = {
  name: "Limit labels",
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <RangeSlider defaultValue={[200, 800]} min={0} max={1000} showLimits />
    </div>
  ),
};

export const WithMarks: Story = {
  name: "Tick marks",
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <RangeSlider
        defaultValue={[25, 75]}
        step={25}
        marks={[
          { value: 0, label: "0%" },
          { value: 25, label: "25%" },
          { value: 50, label: "50%" },
          { value: 75, label: "75%" },
          { value: 100, label: "100%" },
        ]}
      />
    </div>
  ),
};

export const MinGap: Story = {
  name: "Minimum gap between thumbs",
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <RangeSlider
        defaultValue={[40, 60]}
        minStepsBetweenThumbs={10}
        showValues
      />
    </div>
  ),
};

export const Combined: Story = {
  name: "Combined (values + limits + marks)",
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <RangeSlider
        defaultValue={[200, 700]}
        min={0}
        max={1000}
        step={100}
        showValues
        showLimits
        formatValue={(v) => `$${v}`}
        minStepsBetweenThumbs={1}
        marks={[
          { value: 0 },
          { value: 250, label: "$250" },
          { value: 500, label: "$500" },
          { value: 750, label: "$750" },
          { value: 1000 },
        ]}
      />
    </div>
  ),
};

/**
 * A disabled range slider still needs its values legible, so surface the thumb
 * values with `showValues` (and the bounds with `showLimits`) - both stay
 * visible while disabled.
 */
export const Disabled: Story = {
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <RangeSlider defaultValue={[30, 70]} disabled showValues showLimits />
    </div>
  ),
};
