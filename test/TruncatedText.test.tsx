import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TruncatedText } from "../src/components/truncated_text/TruncatedText";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("TruncatedText", () => {
  it("truncates on a single line by default", () => {
    render(<TruncatedText>hello</TruncatedText>);
    const el = screen.getByText("hello");
    expect(el).toHaveClass("du_truncated_text", "du_text_truncate");
  });

  it("clamps to N lines when lines > 1", () => {
    render(<TruncatedText lines={3}>hello</TruncatedText>);
    const el = screen.getByText("hello");
    expect(el).toHaveClass("du_text_clamp");
    expect(el.style.getPropertyValue("--du-clamp")).toBe("3");
  });

  it("attaches no tooltip when the text fits", async () => {
    const { container } = render(<TruncatedText>Short</TruncatedText>);
    await waitFor(() =>
      expect(screen.getByText("Short")).toBeInTheDocument(),
    );
    expect(container.querySelector(".du_tooltip_root")).toBeNull();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("reveals the full text in a tooltip on hover when overflowing", async () => {
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(100);
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(50);
    const user = userEvent.setup();

    const { container } = render(
      <TruncatedText>A rather long label that overflows</TruncatedText>,
    );

    await waitFor(() =>
      expect(container.querySelector(".du_tooltip_root")).not.toBeNull(),
    );

    await user.hover(
      screen.getByText("A rather long label that overflows"),
    );

    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveTextContent("A rather long label that overflows");
  });
});
