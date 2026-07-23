import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Divider } from "../src/components/divider/Divider";

describe("Divider", () => {
  it("renders an <hr> with a separator role when unlabeled horizontal", () => {
    render(<Divider data-testid="d" />);
    const el = screen.getByTestId("d");
    expect(el.tagName).toBe("HR");
    expect(el).toHaveAttribute("role", "separator");
    expect(el).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("renders a div for vertical dividers", () => {
    render(<Divider orientation="vertical" data-testid="d" />);
    const el = screen.getByTestId("d");
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveClass("du_divider_vertical");
    expect(el).toHaveAttribute("aria-orientation", "vertical");
  });

  it("drops the separator role when decorative", () => {
    render(<Divider decorative data-testid="d" />);
    expect(screen.getByTestId("d")).toHaveAttribute("role", "none");
  });

  it("renders a labeled divider as a separator div with the label", () => {
    render(<Divider label="OR" data-testid="d" />);
    const el = screen.getByTestId("d");
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveClass("du_divider_labeled");
    expect(el).toHaveAttribute("role", "separator");
    expect(screen.getByText("OR")).toBeInTheDocument();
  });

  it("forwards refs", () => {
    const ref = createRef<HTMLHRElement>();
    render(<Divider ref={ref} />);
    expect(ref.current?.tagName).toBe("HR");
  });
});
