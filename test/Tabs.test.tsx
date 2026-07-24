import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tab, TabList, TabPanel, Tabs } from "../src/components/tabs/Tabs";

function renderTabs() {
  render(
    <Tabs defaultValue="one">
      <TabList aria-label="Sections">
        <Tab value="one">One</Tab>
        <Tab value="two">Two</Tab>
      </TabList>
      <TabPanel value="one">Panel one</TabPanel>
      <TabPanel value="two">Panel two</TabPanel>
    </Tabs>,
  );
}

describe("Tabs", () => {
  it("exposes tablist/tab/tabpanel roles with correct selection", () => {
    renderTabs();
    expect(
      screen.getByRole("tablist", { name: "Sections" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("Panel one")).toBeVisible();
    expect(screen.queryByText("Panel two")).not.toBeInTheDocument();
  });

  it("switches panels on click", async () => {
    const user = userEvent.setup();
    renderTabs();
    await user.click(screen.getByRole("tab", { name: "Two" }));
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("Panel two")).toBeVisible();
  });

  it("moves selection with arrow keys", async () => {
    const user = userEvent.setup();
    renderTabs();
    screen.getByRole("tab", { name: "One" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("uses Up/Down in vertical orientation", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="one" orientation="vertical">
        <TabList aria-label="V">
          <Tab value="one">One</Tab>
          <Tab value="two">Two</Tab>
        </TabList>
        <TabPanel value="one">Panel one</TabPanel>
        <TabPanel value="two">Panel two</TabPanel>
      </Tabs>,
    );
    expect(screen.getByRole("tablist")).toHaveAttribute(
      "aria-orientation",
      "vertical",
    );
    screen.getByRole("tab", { name: "One" }).focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("manual activation moves focus without selecting until Enter", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="one" activationMode="manual">
        <TabList aria-label="M">
          <Tab value="one">One</Tab>
          <Tab value="two">Two</Tab>
        </TabList>
        <TabPanel value="one">Panel one</TabPanel>
        <TabPanel value="two">Panel two</TabPanel>
      </Tabs>,
    );
    screen.getByRole("tab", { name: "One" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    await user.keyboard("{Enter}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("skips disabled tabs during keyboard navigation", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="one">
        <TabList aria-label="D">
          <Tab value="one">One</Tab>
          <Tab value="two" disabled>
            Two
          </Tab>
          <Tab value="three">Three</Tab>
        </TabList>
        <TabPanel value="one">Panel one</TabPanel>
        <TabPanel value="three">Panel three</TabPanel>
      </Tabs>,
    );
    screen.getByRole("tab", { name: "One" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Three" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("jumps to first/last with Home/End", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="two">
        <TabList aria-label="HE">
          <Tab value="one">One</Tab>
          <Tab value="two">Two</Tab>
          <Tab value="three">Three</Tab>
        </TabList>
        <TabPanel value="one">Panel one</TabPanel>
        <TabPanel value="two">Panel two</TabPanel>
        <TabPanel value="three">Panel three</TabPanel>
      </Tabs>,
    );
    screen.getByRole("tab", { name: "Two" }).focus();
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Three" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    screen.getByRole("tab", { name: "Three" }).focus();
    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("reports selection through onValueChange when controlled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Tabs value="one" onValueChange={onValueChange}>
        <TabList aria-label="C">
          <Tab value="one">One</Tab>
          <Tab value="two">Two</Tab>
        </TabList>
        <TabPanel value="one">Panel one</TabPanel>
        <TabPanel value="two">Panel two</TabPanel>
      </Tabs>,
    );
    await user.click(screen.getByRole("tab", { name: "Two" }));
    expect(onValueChange).toHaveBeenCalledWith("two");
    // Controlled: without a value change the panel does not switch.
    expect(screen.getByText("Panel one")).toBeVisible();
  });

  it("keeps a panel mounted when keepMounted is set", () => {
    render(
      <Tabs defaultValue="one">
        <TabList aria-label="K">
          <Tab value="one">One</Tab>
          <Tab value="two">Two</Tab>
        </TabList>
        <TabPanel value="one">Panel one</TabPanel>
        <TabPanel value="two" keepMounted>
          Panel two
        </TabPanel>
      </Tabs>,
    );
    const panelTwo = screen.getByText("Panel two");
    expect(panelTwo).toBeInTheDocument();
    expect(panelTwo.closest('[role="tabpanel"]')).toHaveAttribute("hidden");
  });
});
