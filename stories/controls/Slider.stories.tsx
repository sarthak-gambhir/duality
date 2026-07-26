import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "../../src";

const meta: Meta<typeof Slider> = {
  title: "Controls/Slider",
  component: Slider,
  args: { min: 0, max: 100, step: 1, defaultValue: 40, "aria-label": "volume" },
  argTypes: {
    invalid: { control: "boolean", description: "Marks the control invalid." },
    disabled: { control: "boolean", description: "Disables the control." },
    showValue: {
      control: "boolean",
      description: "Show a value bubble above the thumb.",
    },
    min: { control: "number", description: "Minimum value." },
    max: { control: "number", description: "Maximum value." },
    step: { control: "number", description: "Step increment." },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  decorators: [(Story) => <div style={{ maxWidth: 320 }}><Story /></div>],
};

function Controlled() {
  const [value, setValue] = useState(40);
  return (
    <div style={{ maxWidth: 320 }}>
      <Slider
        min={0}
        max={100}
        value={value}
        aria-label="volume"
        onChange={(e) => setValue(Number(e.target.value))}
      />
    </div>
  );
}

/** Controlled `value` + `onChange`. */
export const ControlledValue: Story = {
  name: "Controlled",
  render: () => <Controlled />,
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [value, setValue] = useState(40);
  return (
    <Slider
      min={0}
      max={100}
      value={value}
      aria-label="volume"
      onChange={(e) => setValue(Number(e.target.value))}
    />
  );
}`,
      },
    },
  },
};

export const WithValue: Story = {
  name: "Value bubble",
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <Slider
        defaultValue={40}
        aria-label="volume"
        showValue
        formatValue={(v) => `${v}%`}
      />
    </div>
  ),
};

export const WithLimits: Story = {
  name: "Limit labels",
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <Slider
        defaultValue={40}
        min={0}
        max={100}
        aria-label="volume"
        minLabel="Quiet"
        maxLabel="Loud"
      />
    </div>
  ),
};

export const WithMarks: Story = {
  name: "Tick marks",
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Slider
        defaultValue={50}
        step={25}
        aria-label="quality"
        marks={[
          { value: 0, label: "Low" },
          { value: 50, label: "Med" },
          { value: 100, label: "High" },
        ]}
      />
    </div>
  ),
};

export const Combined: Story = {
  name: "Combined (value + limits + marks)",
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Slider
        defaultValue={60}
        min={0}
        max={100}
        step={10}
        aria-label="volume"
        showValue
        formatValue={(v) => `${v}%`}
        minLabel="Quiet"
        maxLabel="Loud"
        marks={[
          { value: 0, label: "0" },
          { value: 25 },
          { value: 50, label: "50" },
          { value: 75 },
          { value: 100, label: "100" },
        ]}
      />
    </div>
  ),
};

/**
 * A disabled slider still needs its value legible, so surface it with
 * `showValue` - it stays visible while disabled. `minLabel`/`maxLabel` give the
 * reading context.
 */
export const Disabled: Story = {
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <Slider
        defaultValue={30}
        disabled
        showValue
        minLabel="0"
        maxLabel="100"
        aria-label="disabled"
      />
    </div>
  ),
};
