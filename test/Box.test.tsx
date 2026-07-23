import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Box } from "../src/components/box/Box";

describe("Box", () => {
  it("renders a div with du_box by default", () => {
    render(<Box>content</Box>);
    const el = screen.getByText("content");
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveClass("du_box");
  });

  it("supports the polymorphic as prop", () => {
    render(
      <Box as="section" aria-label="sec">
        x
      </Box>,
    );
    const el = screen.getByRole("region", { name: "sec" });
    expect(el.tagName).toBe("SECTION");
  });

  it("forwards refs", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Box ref={ref}>x</Box>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("maps padding props to --du-* vars and toggles class modifiers", () => {
    render(
      <Box padding={4} paddingX={6} border radius>
        x
      </Box>,
    );
    const el = screen.getByText("x");
    expect(el).toHaveClass("du_box_border", "du_box_radius");
    expect(el.style.getPropertyValue("--du-p")).toBe("var(--space-4)");
    expect(el.style.getPropertyValue("--du-px")).toBe("var(--space-6)");
  });
});
