import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarGroup, Inline } from "../../src";

const meta: Meta<typeof Avatar> = {
  title: "Display/Avatar",
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component:
          "Square, pixel-framed avatar that shows an image or falls back to initials derived from `name` (also on image load failure).",
      },
    },
  },
  argTypes: {
    name: {
      control: "text",
      description: "Name used to derive initials when no image is given.",
    },
    src: { control: "text", description: "Image source." },
    size: {
      control: "inline-radio",
      options: ["xs", "sm", "md", "lg"],
      description: "Size.",
      table: { defaultValue: { summary: "md" } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  render: () => (
    <Inline gap={3}>
      <Avatar name="Ada Lovelace" size="xs" />
      <Avatar name="Ada Lovelace" size="sm" />
      <Avatar name="Alan Turing" size="md" />
      <Avatar name="Grace Hopper" size="lg" />
    </Inline>
  ),
};

export const ImageFallback: Story = {
  render: () => (
    <Inline gap={3}>
      <Avatar name="Grace Hopper" src="https://invalid.example/nope.png" />
      <Avatar name="Ada Lovelace" src="" />
    </Inline>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup max={3}>
      <Avatar name="Ada Lovelace" />
      <Avatar name="Alan Turing" />
      <Avatar name="Grace Hopper" />
      <Avatar name="Katherine Johnson" />
      <Avatar name="Edsger Dijkstra" />
    </AvatarGroup>
  ),
};
