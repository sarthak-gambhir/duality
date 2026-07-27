import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button, EmptyState } from "../../src";

const meta: Meta<typeof EmptyState> = {
  title: "Display/EmptyState",
  component: EmptyState,
  parameters: {
    docs: {
      description: {
        component:
          "Centered placeholder for empty lists, searches, or first-run screens, with an optional icon, description, and action slot.",
      },
    },
  },
  argTypes: {
    title: { control: "text", description: "Primary heading." },
    description: { control: "text", description: "Supporting explanation." },
    icon: { control: false, description: "Optional visual/marker above the title." },
    action: {
      control: false,
      description: "Action slot (e.g. a Button) shown below the text.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

function DefaultDemo() {
  const [created, setCreated] = useState(false);
  if (created) {
    return (
      <EmptyState
        title="Project created"
        description="Your first project is ready. Add another whenever you like."
        action={<Button onClick={() => setCreated(false)}>Start over</Button>}
      />
    );
  }
  return (
    <EmptyState
      title="No projects yet"
      description="Create your first project to start tracking work across your team."
      action={<Button onClick={() => setCreated(true)}>New project</Button>}
    />
  );
}

export const Default: Story = {
  render: () => <DefaultDemo />,
};

export const TextOnly: Story = {
  render: () => (
    <EmptyState
      title="No results"
      description="Try adjusting your filters or search terms."
    />
  ),
};
