import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SideNav, type SideNavItem } from "../src/components/side_nav/SideNav";

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
});
