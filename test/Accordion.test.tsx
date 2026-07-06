import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
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
});
