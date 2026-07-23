import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Link } from "../src/components/link/Link";

describe("Link", () => {
  it("renders an anchor with du_link", () => {
    render(
      <Link href="#a" underline="always">
        go
      </Link>,
    );
    const el = screen.getByRole("link", { name: "go" });
    expect(el).toHaveClass("du_link");
    expect(el).toHaveAttribute("href", "#a");
  });

  it("adds target/rel and a trailing glyph when external", () => {
    render(
      <Link href="https://example.com" external>
        site
      </Link>,
    );
    const el = screen.getByRole("link", { name: "site" });
    expect(el).toHaveAttribute("target", "_blank");
    expect(el).toHaveAttribute("rel", "noopener noreferrer");
    expect(el.querySelector(".du_link_external_icon")).toBeInTheDocument();
  });

  it("lets an explicit rel/target override the external defaults", () => {
    render(
      <Link href="x" external target="_self" rel="nofollow">
        site
      </Link>,
    );
    const el = screen.getByRole("link", { name: "site" });
    expect(el).toHaveAttribute("target", "_self");
    expect(el).toHaveAttribute("rel", "nofollow");
  });

  it("maps the underline policy to a class", () => {
    render(
      <Link href="#" underline="hover">
        go
      </Link>,
    );
    expect(screen.getByRole("link")).toHaveClass("du_link_underline_hover");
  });

  it("forwards refs", () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Link href="#" ref={ref}>
        go
      </Link>,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });
});
