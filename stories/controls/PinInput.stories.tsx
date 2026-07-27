import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PinInput } from "../../src";

const meta: Meta<typeof PinInput> = {
  title: "Controls/PinInput",
  component: PinInput,
  argTypes: {
    length: {
      control: "number",
      description: "Number of cells.",
      table: { defaultValue: { summary: "4" } },
    },
    type: {
      control: "inline-radio",
      options: ["numeric", "alphanumeric"],
      description: "Accepted characters.",
      table: { defaultValue: { summary: "numeric" } },
    },
    mask: {
      control: "boolean",
      description: "Obscure entered characters (like a password).",
    },
    disabled: { control: "boolean", description: "Disables the control." },
  },
};

export default meta;
type Story = StoryObj<typeof PinInput>;

export const Default: Story = { render: (args) => <PinInput {...args} /> };
export const SixDigits: Story = { render: () => <PinInput length={6} /> };
export const Masked: Story = { render: () => <PinInput mask /> };
export const Alphanumeric: Story = {
  render: () => <PinInput type="alphanumeric" />,
};

function ControlledExample() {
  const [value, setValue] = useState("");
  return (
    <div>
      <PinInput value={value} onValueChange={setValue} />
      <p style={{ fontFamily: "var(--font-mono)" }}>
        Value: {value || "(empty)"}
      </p>
    </div>
  );
}

/** Controlled `value` + `onValueChange`, echoing the assembled code. */
export const Controlled: Story = {
  render: () => <ControlledExample />,
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [value, setValue] = useState("");
  return (
    <div>
      <PinInput value={value} onValueChange={setValue} />
      <p>Value: {value || "(empty)"}</p>
    </div>
  );
}`,
      },
    },
  },
};

/**
 * When disabled, the entered code stays readable on a solid background and the
 * `disabledReason` appears in a persistent caption below the group.
 */
export const DisabledWithReason: Story = {
  render: () => (
    <PinInput
      defaultValue="1234"
      disabled
      disabledReason="Verified on a previous step"
    />
  ),
};
