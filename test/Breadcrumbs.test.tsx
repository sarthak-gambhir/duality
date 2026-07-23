import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Breadcrumbs } from "../src/components/breadcrumbs/Breadcrumbs";

describe("Breadcrumbs", () => {
  it("marks the last crumb as the current page and links the rest", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Components", href: "/components" },
          { label: "Breadcrumbs" },
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
    const current = screen.getByText("Breadcrumbs");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(
      screen.queryByRole("link", { name: "Breadcrumbs" }),
    ).not.toBeInTheDocument();
  });

  it("exposes a labelled nav landmark", () => {
    render(<Breadcrumbs items={[{ label: "Home", href: "/" }]} />);
    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" }),
    ).toBeInTheDocument();
  });

  it("collapses the middle when items exceed maxItems", () => {
    render(
      <Breadcrumbs
        maxItems={4}
        itemsBeforeCollapse={1}
        itemsAfterCollapse={2}
        items={[
          { label: "One", href: "#" },
          { label: "Two", href: "#" },
          { label: "Three", href: "#" },
          { label: "Four", href: "#" },
          { label: "Five", href: "#" },
          { label: "Six" },
        ]}
      />,
    );

    // Kept: first (One) + last two (Five, Six); middle collapsed.
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Five")).toBeInTheDocument();
    expect(screen.getByText("Six")).toBeInTheDocument();
    expect(screen.queryByText("Three")).not.toBeInTheDocument();
  });

  it("renders an onClick crumb as a button and fires it", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Breadcrumbs
        items={[{ label: "Home", onClick }, { label: "Here" }]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Home" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
