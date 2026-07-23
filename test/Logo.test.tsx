import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo } from "../src/components/logo/Logo";

describe("Logo", () => {
  it("renders the two-tone mark", () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector("svg.du_logo");
    expect(svg).toBeInTheDocument();
    expect(svg?.querySelector(".du_logo_disk")).toBeInTheDocument();
    expect(svg?.querySelector(".du_logo_cut")).toBeInTheDocument();
  });

  it("is decorative (aria-hidden) by default", () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector("svg.du_logo");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).not.toHaveAttribute("role");
  });

  it("exposes an accessible name via label", () => {
    render(<Logo label="Duality" />);
    const img = screen.getByRole("img", { name: "Duality" });
    expect(img).toBeInTheDocument();
    expect(img).not.toHaveAttribute("aria-hidden");
  });

  it("forwards size to width and height", () => {
    const { container } = render(<Logo size={48} />);
    const svg = container.querySelector("svg.du_logo");
    expect(svg).toHaveAttribute("width", "48");
    expect(svg).toHaveAttribute("height", "48");
  });

  it("defaults size to 1em", () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector("svg.du_logo");
    expect(svg).toHaveAttribute("width", "1em");
    expect(svg).toHaveAttribute("height", "1em");
  });
});
