import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Banner, Button, Stack } from "../../src";

const meta: Meta<typeof Banner> = {
  title: "Display/Banner",
  component: Banner,
};

export default meta;
type Story = StoryObj<typeof Banner>;

export const Tones: Story = {
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
      if (!open)
        return <Button onClick={() => setOpen(true)}>Show banner</Button>;
      return (
        <Banner
          tone="info"
          title="Cookies"
          action={<Button size="sm">Manage</Button>}
          onDismiss={() => setOpen(false)}
        >
          We use two colors and nothing else.
        </Banner>
      );
    }
    return <Demo />;
  },
};
