import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TagInput } from "../../src";

const meta: Meta<typeof TagInput> = {
  title: "Controls/TagInput",
  component: TagInput,
  argTypes: {
    invalid: {
      control: "boolean",
      description: "Marks the field invalid (dashed border + `aria-invalid`).",
    },
    disabled: { control: "boolean", description: "Disables the control." },
    allowDuplicates: {
      control: "boolean",
      description: "Allow the same tag to be added more than once.",
    },
    max: { control: "number", description: "Maximum number of tags." },
  },
};

export default meta;
type Story = StoryObj<typeof TagInput>;

export const Default: Story = {
  render: (args) => (
    <div style={{ maxInlineSize: 360 }}>
      <TagInput
        {...args}
        defaultValue={["design", "system"]}
        placeholder="Add a tag..."
        aria-label="Tags"
      />
    </div>
  ),
};

function Controlled() {
  const [tags, setTags] = useState<string[]>(["design", "system"]);
  return (
    <div style={{ maxInlineSize: 360 }}>
      <TagInput
        value={tags}
        onValueChange={setTags}
        placeholder="Add a tag..."
        aria-label="Tags"
      />
    </div>
  );
}

/** Controlled `value` + `onValueChange`. */
export const ControlledValue: Story = {
  name: "Controlled",
  render: () => <Controlled />,
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [tags, setTags] = useState<string[]>(["design", "system"]);
  return (
    <TagInput
      value={tags}
      onValueChange={setTags}
      placeholder="Add a tag..."
      aria-label="Tags"
    />
  );
}`,
      },
    },
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ maxInlineSize: 360 }}>
      <TagInput
        defaultValue={["locked", "readonly"]}
        disabled
        aria-label="Tags"
      />
    </div>
  ),
};

/**
 * When disabled, the tags stay readable on a solid background and the
 * `disabledReason` appears in a persistent caption below the field.
 */
export const DisabledWithReason: Story = {
  render: () => (
    <div style={{ maxInlineSize: 360 }}>
      <TagInput
        defaultValue={["design", "system"]}
        disabled
        disabledReason="Tags are inherited from the parent"
        aria-label="Tags"
      />
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div style={{ maxInlineSize: 360 }}>
      <TagInput defaultValue={["oops"]} invalid aria-label="Tags" />
    </div>
  ),
};
