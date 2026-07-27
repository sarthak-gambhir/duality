import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FileUpload } from "../../src";

const meta: Meta<typeof FileUpload> = {
  title: "Controls/FileUpload",
  component: FileUpload,
  parameters: {
    docs: {
      description: {
        component:
          "File picker with a drag-and-drop dropzone and a removable file list. Controlled via `value`/`onValueChange` or uncontrolled via `defaultValue`.",
      },
    },
  },
  argTypes: {
    accept: {
      control: "text",
      description: "`accept` attribute forwarded to the input.",
    },
    multiple: {
      control: "boolean",
      description: "Allow selecting more than one file.",
    },
    disabled: { control: "boolean", description: "Disable the dropzone." },
    disabledReason: {
      control: "text",
      description: "When disabled, reason shown in a persistent caption.",
    },
    label: { control: "text", description: "Prompt shown inside the dropzone." },
  },
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

function Demo({ multiple }: { multiple?: boolean }) {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div style={{ maxWidth: 400 }}>
      <FileUpload value={files} onValueChange={setFiles} multiple={multiple} />
    </div>
  );
}

export const Default: Story = {
  render: () => <Demo />,
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [files, setFiles] = useState<File[]>([]);
  return <FileUpload value={files} onValueChange={setFiles} />;
}`,
      },
    },
  },
};
export const Multiple: Story = { render: () => <Demo multiple /> };
export const Disabled: Story = {
  render: () => (
    <div style={{ maxWidth: 400 }}>
      <FileUpload disabled />
    </div>
  ),
};

/** A disabled dropzone with a persistent `disabledReason` caption below it. */
export const DisabledWithReason: Story = {
  render: () => (
    <div style={{ maxWidth: 400 }}>
      <FileUpload disabled disabledReason="Uploads are paused during maintenance" />
    </div>
  ),
};
