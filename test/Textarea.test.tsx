import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Textarea } from "../src/components/textarea/Textarea";

describe("Textarea", () => {
  it("accepts typed text and marks invalid", async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="msg" invalid />);
    const area = screen.getByRole("textbox", { name: "msg" });
    await user.type(area, "hello");
    expect(area).toHaveValue("hello");
    expect(area).toHaveAttribute("aria-invalid", "true");
  });

  it("shows a character count against maxLength", async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="msg" showCount maxLength={10} />);
    const area = screen.getByRole("textbox", { name: "msg" });
    await user.type(area, "hey");
    expect(screen.getByText("3 / 10")).toBeInTheDocument();
  });

  it("shows a disabled reason caption and links it via aria-describedby", () => {
    render(
      <Textarea
        aria-label="msg"
        disabled
        defaultValue="Terms accepted"
        disabledReason="Locked after acceptance"
      />,
    );
    const area = screen.getByRole("textbox", { name: "msg" });
    const caption = screen.getByText("Locked after acceptance");
    expect(caption).toBeInTheDocument();
    expect(area.getAttribute("aria-describedby")).toContain(caption.id);
  });
});
