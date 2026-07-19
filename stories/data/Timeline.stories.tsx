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

const statusItems: TimelineItem[] = [
  {
    id: "1",
    title: "Deploy started",
    time: "09:24",
    status: "complete",
  },
  {
    id: "2",
    title: "Build failed",
    time: "09:31",
    description: "Type error in the release bundle.",
    status: "error",
  },
  {
    id: "3",
    title: "Retrying with cache disabled",
    time: "09:33",
    description: "Flaky dependency install.",
    status: "warning",
  },
  {
    id: "4",
    title: "Running now",
    time: "09:35",
    status: "current",
  },
  {
    id: "5",
    title: "Publish",
    status: "upcoming",
  },
];

export const Statuses: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Timeline items={statusItems} />
    </div>
  ),
};

const iconItems: TimelineItem[] = [
  {
    id: "1",
    title: "Comment added",
    time: "10:00",
    icon: <span>💬</span>,
  },
  {
    id: "2",
    title: "File attached",
    time: "10:05",
    icon: <span>📎</span>,
  },
  {
    id: "3",
    title: "Approved",
    time: "10:12",
    icon: <span>✓</span>,
  },
];

export const CustomIcons: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Timeline items={iconItems} />
    </div>
  ),
};
