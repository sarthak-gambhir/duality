import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ToggleGroup, ToggleGroupItem } from "../../src";

const meta: Meta<typeof ToggleGroup> = {
  title: "Controls/ToggleGroup",
  component: ToggleGroup,
};

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

function Single() {
  const [value, setValue] = useState<string | string[]>("center");
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={setValue}
      label="Alignment"
    >
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  );
}

function Multiple() {
  const [value, setValue] = useState<string | string[]>(["bold"]);
  return (
    <ToggleGroup
      type="multiple"
      value={value}
      onValueChange={setValue}
      label="Text style"
    >
      <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
      <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
    </ToggleGroup>
  );
}

export const SingleSelect: Story = { render: () => <Single /> };
export const MultipleSelect: Story = { render: () => <Multiple /> };
