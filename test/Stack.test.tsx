import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Stack } from "../src/components/stack/Stack";

describe("Stack", () => {
  it("sets the gap var and default class", () => {
    render(<Stack gap={3}>x</Stack>);
    const el = screen.getByText("x");
    expect(el).toHaveClass("du_stack");
    expect(el.style.getPropertyValue("--du-gap")).toBe("var(--space-3)");
  });

  it("maps align/justify/wrap to inline styles", () => {
    render(
      <Stack align="center" justify="between" wrap>
        x
      </Stack>,
    );
    const el = screen.getByText("x");
    expect(el.style.alignItems).toBe("center");
    expect(el.style.justifyContent).toBe("space-between");
    expect(el.style.flexWrap).toBe("wrap");
  });

  it("supports as and forwards refs", () => {
    const ref = createRef<HTMLUListElement>();
    render(
      <Stack as="ul" ref={ref}>
        <li>a</li>
      </Stack>,
    );
    expect(ref.current).toBeInstanceOf(HTMLUListElement);
  });
});
