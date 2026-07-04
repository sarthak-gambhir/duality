import type { Meta, StoryObj } from "@storybook/react";
import { Link } from "../../src";

const meta: Meta<typeof Link> = {
  title: "Typography/Link",
  component: Link,
  args: { children: "A duality link", href: "#" },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {};
