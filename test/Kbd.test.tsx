import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Kbd } from "../src/components/kbd/Kbd";

describe("Kbd", () => {
  it("renders a single capped key", () => {
    render(<Kbd>Esc</Kbd>);
    const el = screen.getByText("Esc");
    expect(el.tagName).toBe("KBD");
    expect(el).toHaveClass("du_kbd");
  });

  it("renders a combo of capped keys joined by the separator", () => {
    const { container } = render(<Kbd keys={["Ctrl", "S"]} />);
    const combo = container.querySelector(".du_kbd_combo");
    expect(combo).not.toBeNull();
    expect(combo?.querySelectorAll(".du_kbd")).toHaveLength(2);
    expect(screen.getByText("Ctrl")).toBeInTheDocument();
    expect(screen.getByText("S")).toBeInTheDocument();
    expect(container.querySelector(".du_kbd_sep")?.textContent).toBe("+");
  });

  it("honors a custom separator", () => {
    const { container } = render(
      <Kbd keys={["Cmd", "K"]} separator="›" />,
    );
    expect(container.querySelector(".du_kbd_sep")?.textContent).toBe("›");
  });

  it("forwards refs", () => {
    const ref = createRef<HTMLElement>();
    render(<Kbd ref={ref}>A</Kbd>);
    expect(ref.current?.tagName).toBe("KBD");
  });
});
