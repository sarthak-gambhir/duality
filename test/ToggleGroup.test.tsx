import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "../src/components/toggle_group/ToggleGroup";

describe("ToggleGroup (single)", () => {
  it("exposes a radiogroup and selects one value", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <ToggleGroup
        type="single"
        defaultValue="center"
        onValueChange={onValueChange}
        label="Align"
      >
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>,
    );

    expect(screen.getByRole("radiogroup", { name: "Align" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Center" })).toHaveAttribute(
      "aria-checked",
      "true",
    );

    await user.click(screen.getByRole("radio", { name: "Left" }));
    expect(onValueChange).toHaveBeenLastCalledWith("left");
  });

  it("moves selection with arrow keys", async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup type="single" defaultValue="left" label="Align">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
      </ToggleGroup>,
    );
    screen.getByRole("radio", { name: "Left" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Center" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });
});

describe("ToggleGroup (multiple)", () => {
  it("toggles independent values with aria-pressed", async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup type="multiple" defaultValue={["bold"]} label="Style">
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>,
    );

    const bold = screen.getByRole("button", { name: "Bold", pressed: true });
    const italic = screen.getByRole("button", { name: "Italic", pressed: false });

    await user.click(italic);
    expect(italic).toHaveAttribute("aria-pressed", "true");

    await user.click(bold);
    expect(bold).toHaveAttribute("aria-pressed", "false");
  });
});
