import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Timeline,
  type TimelineItem,
} from "../src/components/timeline/Timeline";

const items: TimelineItem[] = [
  { id: "1", title: "Started", status: "complete" },
  { id: "2", title: "Failed", status: "error" },
  { id: "3", title: "Retrying", status: "warning" },
  { id: "4", title: "Running", status: "current" },
  { id: "5", title: "Next", status: "upcoming" },
];

describe("Timeline", () => {
  it("renders all item titles", () => {
    render(<Timeline items={items} />);
    for (const item of items) {
      expect(screen.getByText(item.title as string)).toBeInTheDocument();
    }
  });

  it("exposes each status via data-status", () => {
    const { container } = render(<Timeline items={items} />);
    expect(
      container.querySelector('[data-status="error"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-status="warning"]'),
    ).toBeInTheDocument();
  });

  it("renders a custom icon marker", () => {
    render(
      <Timeline
        items={[
          {
            id: "1",
            title: "Commented",
            icon: <span data-testid="icon">C</span>,
          },
        ]}
      />,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
