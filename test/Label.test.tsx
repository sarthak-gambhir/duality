import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Label } from "../src/components/label/Label";

describe("Label", () => {
  it("renders text and associates via htmlFor", () => {
    render(
      <>
        <Label htmlFor="name">Full name</Label>
        <input id="name" />
      </>,
    );
    expect(screen.getByText("Full name")).toHaveAttribute("for", "name");
    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
  });

  it("shows an aria-hidden required marker", () => {
    render(<Label required>Email</Label>);
    const marker = screen.getByText("*");
    expect(marker).toHaveAttribute("aria-hidden", "true");
  });

  it("exposes a data-disabled hook when disabled", () => {
    render(<Label disabled>Email</Label>);
    expect(screen.getByText("Email")).toHaveAttribute("data-disabled");
  });

  it("forwards its ref to the label element", () => {
    const ref = createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Email</Label>);
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });
});
