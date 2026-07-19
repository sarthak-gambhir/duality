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

  it("renders prefix and suffix adornments", () => {
    render(<Input aria-label="price" prefix="$" suffix="USD" />);
    expect(screen.getByText("$")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "price" })).toBeInTheDocument();
  });

  it("clears the field with the clear button", async () => {
    const user = userEvent.setup();
    render(<Input aria-label="name" clearable defaultValue="duality" />);
    const input = screen.getByRole("textbox", { name: "name" });
    expect(input).toHaveValue("duality");
    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(input).toHaveValue("");
  });

  it("hides the clear button when empty", () => {
    render(<Input aria-label="name" clearable />);
    expect(
      screen.queryByRole("button", { name: "Clear" }),
    ).not.toBeInTheDocument();
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

  it("shows a character count against maxLength", async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="msg" showCount maxLength={10} />);
    const area = screen.getByRole("textbox", { name: "msg" });
    await user.type(area, "hey");
    expect(screen.getByText("3 / 10")).toBeInTheDocument();
  });
});
