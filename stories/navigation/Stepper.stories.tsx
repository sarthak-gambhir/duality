import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button, Inline, Stepper, Text, type StepperStep } from "../../src";

const meta: Meta<typeof Stepper> = {
  title: "Navigation/Stepper",
  component: Stepper,
  parameters: {
    docs: {
      description: {
        component:
          "Progress indicator for a multi-step flow. Status is derived from `activeStep` (complete / current / upcoming) and shown by marker shape - a check for complete, a filled marker for current, an outline for upcoming - never by color alone. A step may override its status with `status: \"error\" | \"warning\"` (swaps in a tone glyph and a heavier outline) and be flagged `optional`. When `onStepChange` is set, completed and current steps are clickable; `allowAllSteps` also makes upcoming steps clickable for non-linear flows. The current step carries `aria-current=\"step\"`.",
      },
    },
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      description: "Layout direction.",
      table: { defaultValue: { summary: "horizontal" } },
    },
    allowAllSteps: {
      control: "boolean",
      description: "Allow clicking upcoming steps too (non-linear flows).",
      table: { defaultValue: { summary: "false" } },
    },
    steps: {
      control: false,
      description:
        "Ordered steps. Each: `{ label, description?, optional?, status? }`.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

const steps: StepperStep[] = [
  { label: "Account", description: "Your details" },
  { label: "Address", description: "Where to ship" },
  { label: "Payment", description: "Card or invoice" },
  { label: "Review", description: "Confirm order" },
];

function Demo({ orientation }: { orientation?: "horizontal" | "vertical" }) {
  const [active, setActive] = useState(1);
  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <Stepper
        steps={steps}
        activeStep={active}
        onStepChange={setActive}
        orientation={orientation}
        aria-label="Checkout progress"
      />
      <Inline gap={2}>
        <Button
          variant="ghost"
          onClick={() => setActive((s) => Math.max(0, s - 1))}
          disabled={active === 0}
        >
          Back
        </Button>
        <Button
          onClick={() => setActive((s) => Math.min(steps.length - 1, s + 1))}
          disabled={active === steps.length - 1}
        >
          Next
        </Button>
      </Inline>
    </div>
  );
}

export const Default: Story = { render: () => <Demo /> };
export const Vertical: Story = {
  render: () => <Demo orientation="vertical" />,
};

export const WithErrorAndWarning: Story = {
  render: () => (
    <Stepper
      aria-label="Upload progress"
      activeStep={2}
      steps={[
        { label: "Select", description: "Pick files" },
        { label: "Validate", description: "Schema failed", status: "error" },
        { label: "Upload", description: "Slow connection", status: "warning" },
        { label: "Done", description: "Finish" },
      ]}
    />
  ),
};

export const Optional: Story = {
  render: () => (
    <Stepper
      aria-label="Signup"
      activeStep={1}
      steps={[
        { label: "Email", description: "Required" },
        { label: "Profile photo", description: "Skip if unsure", optional: true },
        { label: "Confirm" },
      ]}
    />
  ),
};

function NonLinearDemo() {
  const [active, setActive] = useState(1);
  return (
    <div style={{ display: "grid", gap: "var(--space-3)" }}>
      <Stepper
        aria-label="Non-linear"
        steps={steps}
        activeStep={active}
        onStepChange={setActive}
        allowAllSteps
      />
      <Text size="sm">
        Any step is clickable (even upcoming). Active: {steps[active]?.label}
      </Text>
    </div>
  );
}

export const NonLinear: Story = { render: () => <NonLinearDemo /> };
