import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Accordion,
  AccordionItem,
} from "../src/components/accordion/Accordion";

describe("Accordion", () => {
  it("single mode keeps only one item open", async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" defaultValue="a">
        <AccordionItem value="a" title="First">
          First body
        </AccordionItem>
        <AccordionItem value="b" title="Second">
          Second body
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByRole("button", { name: "First" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByText("First body")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Second" }));
    expect(screen.getByRole("button", { name: "Second" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("button", { name: "First" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.queryByText("First body")).not.toBeInTheDocument();
  });

  it("multiple mode allows several open items", async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="multiple">
        <AccordionItem value="a" title="First">
          First body
        </AccordionItem>
        <AccordionItem value="b" title="Second">
          Second body
        </AccordionItem>
      </Accordion>,
    );

    await user.click(screen.getByRole("button", { name: "First" }));
    await user.click(screen.getByRole("button", { name: "Second" }));
    expect(screen.getByText("First body")).toBeInTheDocument();
    expect(screen.getByText("Second body")).toBeInTheDocument();
  });

  it("reports the open value through onValueChange when controlled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Accordion type="single" value="a" onValueChange={onValueChange}>
        <AccordionItem value="a" title="First">
          First body
        </AccordionItem>
        <AccordionItem value="b" title="Second">
          Second body
        </AccordionItem>
      </Accordion>,
    );
    await user.click(screen.getByRole("button", { name: "Second" }));
    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("collapsible={false} keeps the open item open on re-click", async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" defaultValue="a" collapsible={false}>
        <AccordionItem value="a" title="First">
          First body
        </AccordionItem>
        <AccordionItem value="b" title="Second">
          Second body
        </AccordionItem>
      </Accordion>,
    );
    await user.click(screen.getByRole("button", { name: "First" }));
    expect(screen.getByRole("button", { name: "First" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("moves focus between headers with arrow keys and Home/End", async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single">
        <AccordionItem value="a" title="First">
          First body
        </AccordionItem>
        <AccordionItem value="b" title="Second">
          Second body
        </AccordionItem>
        <AccordionItem value="c" title="Third">
          Third body
        </AccordionItem>
      </Accordion>,
    );
    screen.getByRole("button", { name: "First" }).focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("button", { name: "Second" })).toHaveFocus();
    await user.keyboard("{End}");
    expect(screen.getByRole("button", { name: "Third" })).toHaveFocus();
    await user.keyboard("{Home}");
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
  });

  it("does not toggle a disabled item", async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single">
        <AccordionItem value="a" title="First" disabled>
          First body
        </AccordionItem>
      </Accordion>,
    );
    const trigger = screen.getByRole("button", { name: "First" });
    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("renders each header at the configured heading level", () => {
    render(
      <Accordion type="single" headingLevel={2}>
        <AccordionItem value="a" title="First">
          First body
        </AccordionItem>
      </Accordion>,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "First" }),
    ).toBeInTheDocument();
  });
});
