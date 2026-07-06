import type { Meta, StoryObj } from "@storybook/react";
import { Timeline, type TimelineItem } from "../../src";

const meta: Meta<typeof Timeline> = {
  title: "Data/Timeline",
  component: Timeline,
};

export default meta;
type Story = StoryObj<typeof Timeline>;

const items: TimelineItem[] = [
  {
    id: "1",
    title: "Order placed",
    time: "09:24",
    description: "Payment confirmed and receipt sent.",
    status: "complete",
  },
  {
    id: "2",
    title: "Packed",
    time: "11:02",
    description: "Items collected and boxed at the warehouse.",
    status: "complete",
  },
  {
    id: "3",
    title: "Out for delivery",
    time: "14:40",
    description: "On the truck, arriving today.",
    status: "current",
  },
  {
    id: "4",
    title: "Delivered",
    description: "Estimated by 6:00 PM.",
    status: "upcoming",
  },
];

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Timeline items={items} />
    </div>
  ),
};
