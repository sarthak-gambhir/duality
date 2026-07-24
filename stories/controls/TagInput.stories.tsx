import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TagInput } from "../../src";

const meta: Meta<typeof TagInput> = {
  title: "Controls/TagInput",
  component: TagInput,
};

export default meta;
type Story = StoryObj<typeof TagInput>;

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

export const Default: Story = { render: () => <Controlled /> };

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
 * When disabled, hovering the field shows the committed tags (and an optional
 * `disabledReason`) in a tooltip. Hover-only, since disabled controls cannot
 * receive keyboard focus.
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
