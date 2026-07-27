import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Banner, Button, Stack } from "../../src";

const meta: Meta<typeof Banner> = {
  title: "Display/Banner",
  component: Banner,
  parameters: {
    docs: {
      description: {
        component:
          "Full-width, page-level callout. Tone is signalled by marker shape and border style (never color); optionally dismissible with a trailing action slot.",
      },
    },
  },
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["info", "warning", "error"],
      description: "Severity, signalled by marker shape + border style.",
      table: { defaultValue: { summary: "info" } },
    },
    title: { control: "text", description: "Optional bold heading." },
    action: { control: false, description: "Trailing action slot (e.g. a Button)." },
    onDismiss: {
      control: false,
      description: "Show a close button and call this when pressed.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Banner>;

export const Default: Story = {
  render: () => (
    <Stack gap={3}>
      <Banner tone="info" title="Heads up">
        A new version is available.
      </Banner>
      <Banner tone="warning" title="Maintenance">
        Scheduled downtime this weekend.
      </Banner>
      <Banner tone="error" title="Action required">
        Your payment method has expired.
      </Banner>
    </Stack>
  ),
};

export const Dismissible: Story = {
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(true);
      const [managing, setManaging] = useState(false);
      if (!open)
        return <Button onClick={() => setOpen(true)}>Show banner</Button>;
      return (
        <Stack gap={2}>
          <Banner
            tone="info"
            title="Cookies"
            action={
              <Button size="sm" onClick={() => setManaging((prev) => !prev)}>
                Manage
              </Button>
            }
            onDismiss={() => setOpen(false)}
          >
            We use two colors and nothing else.
          </Banner>
          {managing && <span>Preferences panel opened.</span>}
        </Stack>
      );
    }
    return <Demo />;
  },
};
