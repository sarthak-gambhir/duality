import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Input } from "../src/components/input/Input";
import { Textarea } from "../src/components/textarea/Textarea";

describe("Input", () => {
  it("accepts typed text", async () => {
    const user = userEvent.setup();
    render(<Input aria-label="name" />);
    const input = screen.getByRole("textbox", { name: "name" });
    await user.type(input, "duality");
    expect(input).toHaveValue("duality");
  });

  it("sets aria-invalid when invalid", () => {
    render(<Input aria-label="name" invalid />);
    expect(screen.getByRole("textbox", { name: "name" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("is disabled", () => {
    render(<Input aria-label="name" disabled />);
    expect(screen.getByRole("textbox", { name: "name" })).toBeDisabled();
  });
});

describe("Textarea", () => {
  it("accepts typed text and marks invalid", async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="msg" invalid />);
    const area = screen.getByRole("textbox", { name: "msg" });
    await user.type(area, "hello");
    expect(area).toHaveValue("hello");
    expect(area).toHaveAttribute("aria-invalid", "true");
  });
});
