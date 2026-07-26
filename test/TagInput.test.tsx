import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TagInput } from "../src/components/tag_input/TagInput";

describe("TagInput", () => {
  it("adds a tag on Enter", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<TagInput onValueChange={onValueChange} aria-label="Tags" />);
    const input = screen.getByRole("textbox", { name: "Tags" });

    await user.type(input, "alpha{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(["alpha"]);
  });

  it("adds a tag on comma and ignores duplicates", async () => {
    const user = userEvent.setup();
    render(<TagInput defaultValue={["alpha"]} aria-label="Tags" />);
    const input = screen.getByRole("textbox", { name: "Tags" });

    await user.type(input, "beta,");
    expect(screen.getByText("beta")).toBeInTheDocument();

    await user.type(input, "alpha{Enter}");
    // Only one 'alpha' chip remains.
    expect(screen.getAllByText("alpha")).toHaveLength(1);
  });

  it("removes the last tag on Backspace when empty", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <TagInput
        defaultValue={["one", "two"]}
        onValueChange={onValueChange}
        aria-label="Tags"
      />,
    );
    const input = screen.getByRole("textbox", { name: "Tags" });

    input.focus();
    await user.keyboard("{Backspace}");
    expect(onValueChange).toHaveBeenLastCalledWith(["one"]);
  });

  it("removes a tag via its chip button", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <TagInput
        defaultValue={["one", "two"]}
        onValueChange={onValueChange}
        aria-label="Tags"
      />,
    );
    await user.click(screen.getByRole("button", { name: "Remove one" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["two"]);
  });
});

describe("TagInput disabled reason caption", () => {
  it("renders the reason caption and wires it via aria-describedby", () => {
    const { container } = render(
      <TagInput
        defaultValue={["one", "two"]}
        disabled
        disabledReason="Inherited from parent"
        aria-label="Tags"
      />,
    );
    const caption = container.querySelector(".du_disabled_message");
    expect(caption).toHaveTextContent("Inherited from parent");
    expect(screen.getByRole("textbox").getAttribute("aria-describedby")).toBe(
      caption!.id,
    );
  });

  it("renders no caption when disabled without a reason", () => {
    const { container } = render(
      <TagInput defaultValue={["one", "two"]} disabled aria-label="Tags" />,
    );
    expect(container.querySelector(".du_disabled_message")).toBeNull();
    expect(container.querySelector(".du_disabled_message_wrap")).toBeNull();
  });

  it("renders no caption when enabled", () => {
    const { container } = render(
      <TagInput defaultValue={["one"]} aria-label="Tags" />,
    );
    expect(container.querySelector(".du_disabled_message")).toBeNull();
  });
});
