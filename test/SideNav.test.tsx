import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  SideNav,
  type SideNavItem,
  type SideNavSection,
} from "../src/components/side_nav/SideNav";

function renderNav(onSelect = vi.fn(), activeId = "overview") {
  const items: SideNavItem[] = [
    { id: "overview", label: "Overview", onSelect },
    { id: "projects", label: "Projects", onSelect },
    { id: "billing", label: "Billing", disabled: true },
  ];
  render(<SideNav items={items} activeId={activeId} aria-label="Main" />);
  return onSelect;
}

describe("SideNav", () => {
  it("marks the active item with aria-current", () => {
    renderNav();
    expect(screen.getByRole("button", { name: "Overview" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("button", { name: "Projects" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("calls onSelect for an enabled item", async () => {
    const user = userEvent.setup();
    const onSelect = renderNav();
    await user.click(screen.getByRole("button", { name: "Projects" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("does not select a disabled item", async () => {
    const user = userEvent.setup();
    const onSelect = renderNav();
    const billing = screen.getByRole("button", { name: "Billing" });
    expect(billing).toBeDisabled();
    await user.click(billing);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("exposes a nav landmark with its label", () => {
    renderNav();
    expect(
      screen.getByRole("navigation", { name: "Main" }),
    ).toBeInTheDocument();
  });

  it("renders a trailing badge for an item", () => {
    const items: SideNavItem[] = [
      { id: "files", label: "Files", badge: "12", onSelect: vi.fn() },
    ];
    render(<SideNav items={items} aria-label="Main" />);
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("surfaces a label+badge tooltip on hover when collapsed", async () => {
    const user = userEvent.setup();
    const items: SideNavItem[] = [
      { id: "files", label: "Files", badge: "12", onSelect: vi.fn() },
    ];
    render(<SideNav items={items} collapsed aria-label="Main" />);

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    await user.hover(screen.getByRole("button", { name: /Files/ }));

    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveTextContent("Files");
    expect(tooltip).toHaveTextContent("12");
  });

  it("toggles a collapsible section", async () => {
    const user = userEvent.setup();
    const sections: SideNavSection[] = [
      {
        id: "s1",
        label: "Workspace",
        collapsible: true,
        items: [{ id: "overview", label: "Overview", onSelect: vi.fn() }],
      },
    ];
    render(<SideNav sections={sections} aria-label="Main" />);

    const heading = screen.getByRole("button", { name: "Workspace" });
    expect(heading).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Overview" })).toBeVisible();

    await user.click(heading);
    expect(heading).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.getByRole("button", { name: "Overview", hidden: true }),
    ).not.toBeVisible();
  });
});
