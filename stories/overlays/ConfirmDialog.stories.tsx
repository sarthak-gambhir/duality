import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button, ConfirmDialog } from "../../src";

const meta: Meta<typeof ConfirmDialog> = {
  title: "Overlays/ConfirmDialog",
  component: ConfirmDialog,
  parameters: {
    docsMinHeight: 360,
    docs: {
      description: {
        component:
          "Confirmation dialog built on Modal. Focuses the confirm action on open (Cancel for destructive actions) and shows a pending state for async confirms.",
      },
    },
  },
  argTypes: {
    title: { control: "text", description: "Dialog heading." },
    description: { control: "text", description: "Explanatory body text." },
    confirmLabel: { control: "text", description: "Confirm button label." },
    cancelLabel: { control: "text", description: "Cancel button label." },
    tone: {
      control: "inline-radio",
      options: ["default", "danger"],
      description: "`danger` signals a destructive action via a heavier confirm border.",
      table: { defaultValue: { summary: "default" } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

function Demo({ tone }: { tone?: "default" | "danger" }) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState("");
  return (
    <>
      <Button
        variant={tone === "danger" ? "inverse" : "solid"}
        onClick={() => setOpen(true)}
      >
        {tone === "danger" ? "Delete project" : "Publish"}
      </Button>
      {result && <p>Last action: {result}</p>}
      <ConfirmDialog
        isOpen={open}
        tone={tone}
        title={tone === "danger" ? "Delete project?" : "Publish changes?"}
        description={
          tone === "danger"
            ? "This permanently removes the project and all of its data. This cannot be undone."
            : "Your changes will be visible to everyone right away."
        }
        confirmLabel={tone === "danger" ? "Delete" : "Publish"}
        onConfirm={() => {
          setResult("confirmed");
          setOpen(false);
        }}
        onCancel={() => {
          setResult("cancelled");
          setOpen(false);
        }}
      />
    </>
  );
}

export const Default: Story = { render: () => <Demo /> };
export const Danger: Story = { render: () => <Demo tone="danger" /> };

function AsyncDemo() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState("");
  return (
    <>
      <Button onClick={() => setOpen(true)}>Save (async)</Button>
      {result && <p>Last action: {result}</p>}
      <ConfirmDialog
        isOpen={open}
        title="Save changes?"
        description="This simulates a 1.5s network request; buttons show a pending state."
        confirmLabel="Save"
        onConfirm={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          setResult("saved");
          setOpen(false);
        }}
        onCancel={() => {
          setResult("cancelled");
          setOpen(false);
        }}
      />
    </>
  );
}

export const AsyncConfirm: Story = { render: () => <AsyncDemo /> };

function NoDescriptionDemo() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState("");
  return (
    <>
      <Button onClick={() => setOpen(true)}>Confirm (no description)</Button>
      {result && <p>Last action: {result}</p>}
      <ConfirmDialog
        isOpen={open}
        title="Mark all as read?"
        confirmLabel="Yes"
        onConfirm={() => {
          setResult("confirmed");
          setOpen(false);
        }}
        onCancel={() => {
          setResult("cancelled");
          setOpen(false);
        }}
      />
    </>
  );
}

export const NoDescription: Story = { render: () => <NoDescriptionDemo /> };
