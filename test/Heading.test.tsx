import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Heading } from "../src/components/heading/Heading";

describe("Heading", () => {
  it("renders the matching h{level} element", () => {
    render(<Heading level={3}>Title</Heading>);
    const el = screen.getByRole("heading", { level: 3, name: "Title" });
    expect(el.tagName).toBe("H3");
    expect(el).toHaveClass("du_heading", "du_heading_3");
  });

  it("decouples visual size from the semantic level", () => {
    render(
      <Heading level={2} visualLevel={4}>
        Title
      </Heading>,
    );
    const el = screen.getByRole("heading", { level: 2 });
    expect(el.tagName).toBe("H2");
    expect(el).toHaveClass("du_heading_4");
    expect(el).not.toHaveClass("du_heading_2");
  });

  it("forwards refs", () => {
    const ref = createRef<HTMLHeadingElement>();
    render(<Heading ref={ref}>Title</Heading>);
    expect(ref.current?.tagName).toBe("H2");
  });
});
