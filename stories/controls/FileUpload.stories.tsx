import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FileUpload } from "../../src";

const meta: Meta<typeof FileUpload> = {
  title: "Controls/FileUpload",
  component: FileUpload,
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

export const Default: Story = { render: () => <Demo /> };
export const Multiple: Story = { render: () => <Demo multiple /> };
export const Disabled: Story = {
  render: () => (
    <div style={{ maxWidth: 400 }}>
      <FileUpload disabled />
    </div>
  ),
};
