import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "../src/components/sidebar/Sidebar";

function renderSidebar(props: Record<string, unknown> = {}) {
  return render(
    <Sidebar aria-label="App" {...props}>
      <SidebarHeader>Brand</SidebarHeader>
      <SidebarBody>Body</SidebarBody>
      <SidebarFooter>
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>,
  );
}

describe("Sidebar", () => {
  it("exposes a labelled landmark and renders its slots", () => {
    renderSidebar();
    expect(
      screen.getByRole("complementary", { name: "App" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Brand")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("toggles collapsed state via the trigger (uncontrolled)", async () => {
    const user = userEvent.setup();
    renderSidebar();
    const aside = screen.getByRole("complementary", { name: "App" });
    const trigger = screen.getByRole("button", { name: "Collapse sidebar" });

    expect(aside).not.toHaveAttribute("data-collapsed");
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.click(trigger);

    expect(aside).toHaveAttribute("data-collapsed");
    expect(
      screen.getByRole("button", { name: "Expand sidebar" }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("supports controlled collapsed state", async () => {
    const onCollapsedChange = vi.fn();
    const user = userEvent.setup();
    renderSidebar({ collapsed: true, onCollapsedChange });

    const aside = screen.getByRole("complementary", { name: "App" });
    expect(aside).toHaveAttribute("data-collapsed");

    // Controlled: pressing the trigger reports intent but does not self-update.
    await user.click(screen.getByRole("button", { name: "Expand sidebar" }));
    expect(onCollapsedChange).toHaveBeenCalledWith(false);
    expect(aside).toHaveAttribute("data-collapsed");
  });

  it("stays expanded and hides the trigger when not collapsible", () => {
    renderSidebar({ collapsible: false });
    const aside = screen.getByRole("complementary", { name: "App" });
    expect(aside).not.toHaveAttribute("data-collapsed");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("ignores a controlled collapsed value when not collapsible", () => {
    renderSidebar({ collapsible: false, collapsed: true });
    const aside = screen.getByRole("complementary", { name: "App" });
    expect(aside).not.toHaveAttribute("data-collapsed");
  });

  it("applies custom widths as CSS vars", () => {
    renderSidebar({ width: 300, collapsedWidth: 48 });
    const aside = screen.getByRole("complementary", { name: "App" });
    expect(aside.style.getPropertyValue("--du-sidebar-w")).toBe("300px");
    expect(aside.style.getPropertyValue("--du-sidebar-collapsed-w")).toBe(
      "48px",
    );
  });
});
