import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TimePicker } from "../src/components/time_picker/TimePicker";

describe("TimePicker", () => {
  it("opens the panel and reflects the current selection", async () => {
    const user = userEvent.setup();
    render(<TimePicker defaultValue="09:30" aria-label="Time" />);
    const trigger = screen.getByRole("button", { name: "Time" });
    expect(trigger).toHaveTextContent("09:30");

    await user.click(trigger);
    expect(screen.getByRole("listbox", { name: "Hours" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "09" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("option", { name: "30" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("commits an HH:mm value when an hour is chosen", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <TimePicker
        defaultValue="09:30"
        onValueChange={onValueChange}
        aria-label="Time"
      />,
    );
    await user.click(screen.getByRole("button", { name: "Time" }));
    await user.click(screen.getByRole("option", { name: "11" }));
    expect(onValueChange).toHaveBeenCalledWith("11:30");
  });

  it("supports a 12-hour clock with an AM/PM column", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <TimePicker
        defaultValue="09:30"
        hour12
        onValueChange={onValueChange}
        aria-label="Time"
      />,
    );
    await user.click(screen.getByRole("button", { name: "Time" }));
    expect(screen.getByRole("listbox", { name: "Period" })).toBeInTheDocument();

    await user.click(screen.getByRole("option", { name: "PM" }));
    expect(onValueChange).toHaveBeenCalledWith("21:30");
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<TimePicker defaultValue="09:30" aria-label="Time" />);
    await user.click(screen.getByRole("button", { name: "Time" }));
    expect(screen.getByRole("listbox", { name: "Hours" })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(
      screen.queryByRole("listbox", { name: "Hours" }),
    ).not.toBeInTheDocument();
  });

  it("clears the value via the clear affordance", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <TimePicker
        defaultValue="09:30"
        clearable
        onValueChange={onValueChange}
        aria-label="Time"
      />,
    );
    await user.click(screen.getByRole("button", { name: "Clear time" }));
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it("disables hours and minutes outside the min/max bounds", async () => {
    const user = userEvent.setup();
    render(
      <TimePicker
        defaultValue="10:00"
        min="09:00"
        max="17:00"
        step={15}
        aria-label="Time"
      />,
    );
    await user.click(screen.getByRole("button", { name: "Time" }));
    expect(screen.getByRole("option", { name: "08" })).toBeDisabled();
    expect(screen.getByRole("option", { name: "18" })).toBeDisabled();
    expect(screen.getByRole("option", { name: "09" })).not.toBeDisabled();
  });

  it("navigates options within a column using arrow keys", async () => {
    const user = userEvent.setup();
    render(<TimePicker defaultValue="09:30" aria-label="Time" />);
    await user.click(screen.getByRole("button", { name: "Time" }));

    const hours = within(screen.getByRole("listbox", { name: "Hours" }));
    hours.getByRole("option", { name: "09" }).focus();
    await user.keyboard("{ArrowDown}");
    expect(hours.getByRole("option", { name: "10" })).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(hours.getByRole("option", { name: "09" })).toHaveFocus();
  });
});

describe("TimePicker disabled reason caption", () => {
  it("renders the reason caption and wires it via aria-describedby", () => {
    const { container } = render(
      <TimePicker
        defaultValue="09:30"
        disabled
        disabledReason="Fixed by the schedule"
        aria-label="Time"
      />,
    );
    const caption = container.querySelector(".du_disabled_message");
    expect(caption).toHaveTextContent("Fixed by the schedule");
    expect(
      screen.getByRole("button", { name: "Time" }).getAttribute("aria-describedby"),
    ).toBe(caption!.id);
  });

  it("renders no caption when disabled without a reason", () => {
    const { container } = render(
      <TimePicker defaultValue="09:30" disabled aria-label="Time" />,
    );
    expect(container.querySelector(".du_disabled_message")).toBeNull();
    expect(container.querySelector(".du_disabled_message_wrap")).toBeNull();
  });

  it("renders no caption when enabled", () => {
    const { container } = render(
      <TimePicker defaultValue="09:30" aria-label="Time" />,
    );
    expect(container.querySelector(".du_disabled_message")).toBeNull();
  });
});
