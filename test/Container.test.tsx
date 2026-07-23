import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Container } from "../src/components/container/Container";

describe("Container", () => {
  it("defaults to the lg size token", () => {
    render(<Container>x</Container>);
    const el = screen.getByText("x");
    expect(el).toHaveClass("du_container");
    expect(el.style.getPropertyValue("--du-max")).toBe("var(--container-lg)");
  });

  it("maps a size preset to the matching token", () => {
    render(<Container size="sm">x</Container>);
    expect(screen.getByText("x").style.getPropertyValue("--du-max")).toBe(
      "var(--container-sm)",
    );
  });

  it("prefers an explicit maxWidth over size", () => {
    render(
      <Container size="sm" maxWidth={500}>
        x
      </Container>,
    );
    expect(screen.getByText("x").style.getPropertyValue("--du-max")).toBe(
      "500px",
    );
  });

  it("maps padding and renders as main with a ref", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Container as="main" ref={ref} padding={2}>
        x
      </Container>,
    );
    const el = screen.getByRole("main");
    expect(el.style.getPropertyValue("--du-pad")).toBe("var(--space-2)");
    expect(ref.current?.tagName).toBe("MAIN");
  });
});
