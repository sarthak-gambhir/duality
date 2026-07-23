import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Code } from "../src/components/code/Code";

describe("Code", () => {
  it("renders an inline code span by default", () => {
    render(<Code>npm i</Code>);
    const el = screen.getByText("npm i");
    expect(el.tagName).toBe("CODE");
    expect(el).toHaveClass("du_code");
    expect(el.closest("pre")).toBeNull();
  });

  it("wraps a pre>code surface in block mode", () => {
    render(<Code block>let x = 1;</Code>);
    const code = screen.getByText("let x = 1;");
    expect(code).toHaveClass("du_code", "du_code_in_block");
    const pre = code.closest("pre");
    expect(pre).not.toBeNull();
    expect(pre).toHaveClass("du_code_block");
  });

  it("forwards refs to the code element", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Code block ref={ref}>
        x
      </Code>,
    );
    expect(ref.current?.tagName).toBe("CODE");
  });
});
