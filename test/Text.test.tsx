import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Text } from "../src/components/text/Text";

describe("Text", () => {
  it("applies size and weight classes", () => {
    render(
      <Text size="lg" weight="bold">
        hi
      </Text>,
    );
    const el = screen.getByText("hi");
    expect(el).toHaveClass("du_text", "du_text_lg", "du_text_bold");
  });

  it("supports explicit normal weight and mono", () => {
    render(
      <Text weight="normal" mono>
        hi
      </Text>,
    );
    expect(screen.getByText("hi")).toHaveClass("du_text_normal", "du_text_mono");
  });

  it("truncates on a single line", () => {
    render(<Text truncate>hi</Text>);
    expect(screen.getByText("hi")).toHaveClass("du_text_truncate");
  });

  it("clamps to N lines via --du-clamp", () => {
    render(<Text lineClamp={3}>hi</Text>);
    const el = screen.getByText("hi");
    expect(el).toHaveClass("du_text_clamp");
    expect(el.style.getPropertyValue("--du-clamp")).toBe("3");
  });

  it("truncate wins over lineClamp", () => {
    render(
      <Text truncate lineClamp={3}>
        hi
      </Text>,
    );
    const el = screen.getByText("hi");
    expect(el).toHaveClass("du_text_truncate");
    expect(el).not.toHaveClass("du_text_clamp");
  });

  it("maps align and forwards refs via as", () => {
    const ref = createRef<HTMLParagraphElement>();
    render(
      <Text as="p" ref={ref} align="center">
        hi
      </Text>,
    );
    const el = screen.getByText("hi");
    expect(el.tagName).toBe("P");
    expect(el.style.textAlign).toBe("center");
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });
});
