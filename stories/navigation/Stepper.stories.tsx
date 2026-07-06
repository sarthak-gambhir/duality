import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button, Inline, Stepper, type StepperStep } from "../../src";

const meta: Meta<typeof Stepper> = {
  title: "Navigation/Stepper",
  component: Stepper,
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

export const Horizontal: Story = { render: () => <Demo /> };
export const Vertical: Story = {
  render: () => <Demo orientation="vertical" />,
};
