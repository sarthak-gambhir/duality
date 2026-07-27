import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ToggleGroup, ToggleGroupItem } from "../../src";

const meta: Meta<typeof ToggleGroup> = {
  title: "Controls/ToggleGroup",
  component: ToggleGroup,
  argTypes: {
    type: {
      control: "inline-radio",
      options: ["single", "multiple"],
      description: "Single selection (radio-like) or multiple independent toggles.",
      table: { defaultValue: { summary: "single" } },
    },
    disabled: {
      control: "boolean",
      description: "Disables every item in the group.",
    },
    label: { control: "text", description: "Accessible group label." },
  },
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

export const Default: Story = {
  render: () => <Single />,
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [value, setValue] = useState<string | string[]>("center");
  return (
    <ToggleGroup type="single" value={value} onValueChange={setValue} label="Alignment">
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  );
}`,
      },
    },
  },
};

export const MultipleSelect: Story = {
  render: () => <Multiple />,
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [value, setValue] = useState<string | string[]>(["bold"]);
  return (
    <ToggleGroup type="multiple" value={value} onValueChange={setValue} label="Text style">
      <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
      <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
    </ToggleGroup>
  );
}`,
      },
    },
  },
};
