import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Inline } from "../src/components/inline/Inline";

describe("Inline", () => {
  it("applies defaults: centered, wrapping", () => {
    render(<Inline>x</Inline>);
    const el = screen.getByText("x");
    expect(el).toHaveClass("du_inline");
    expect(el.style.alignItems).toBe("center");
    expect(el.style.flexWrap).toBe("wrap");
  });

  it("maps extended justify values", () => {
    render(<Inline justify="evenly">x</Inline>);
    expect(screen.getByText("x").style.justifyContent).toBe("space-evenly");
  });

  it("disables wrapping when wrap is false", () => {
    render(<Inline wrap={false}>x</Inline>);
    expect(screen.getByText("x").style.flexWrap).toBe("nowrap");
  });

  it("supports as and forwards refs", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Inline as="nav" ref={ref} aria-label="n">
        x
      </Inline>,
    );
    expect(ref.current?.tagName).toBe("NAV");
  });
});
