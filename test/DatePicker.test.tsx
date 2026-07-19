import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DatePicker } from "../src/components/date_picker/DatePicker";

describe("DatePicker", () => {
  it("shows the formatted value and opens a calendar grid", async () => {
    const user = userEvent.setup();
    render(
      <DatePicker defaultValue={new Date(2026, 6, 15)} aria-label="date" />,
    );

    const trigger = screen.getByRole("button", { name: "date" });
    expect(trigger).toHaveTextContent("2026-07-15");

    await user.click(trigger);
    expect(screen.getByRole("grid", { name: "July 2026" })).toBeInTheDocument();
  });

  it("selects a day and closes", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DatePicker
        defaultValue={new Date(2026, 6, 15)}
        aria-label="date"
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "date" }));
    await user.click(screen.getByRole("gridcell", { name: "July 20, 2026" }));

    const picked = onValueChange.mock.calls.at(-1)?.[0] as Date;
    expect(picked.getFullYear()).toBe(2026);
    expect(picked.getMonth()).toBe(6);
    expect(picked.getDate()).toBe(20);
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
  });

  it("navigates to the previous month", async () => {
    const user = userEvent.setup();
    render(
      <DatePicker defaultValue={new Date(2026, 6, 15)} aria-label="date" />,
    );
    await user.click(screen.getByRole("button", { name: "date" }));
    await user.click(screen.getByRole("button", { name: "Previous month" }));
    expect(screen.getByRole("grid", { name: "June 2026" })).toBeInTheDocument();
  });

  it("moves focus with the keyboard and selects with Enter", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DatePicker
        defaultValue={new Date(2026, 6, 15)}
        aria-label="date"
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: "date" }));
    await user.keyboard("{ArrowRight}{Enter}");
    const picked = onValueChange.mock.calls.at(-1)?.[0] as Date;
    expect(picked.getDate()).toBe(16);
  });

  it("is disabled", () => {
    render(
      <DatePicker
        defaultValue={new Date(2026, 6, 15)}
        disabled
        aria-label="date"
      />,
    );
    expect(screen.getByRole("button", { name: "date" })).toBeDisabled();
  });

  it("clears the value via the trigger affordance", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DatePicker
        defaultValue={new Date(2026, 6, 15)}
        clearable
        aria-label="date"
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Clear date" }));
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it("clears from the footer action", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DatePicker
        defaultValue={new Date(2026, 6, 15)}
        clearable
        aria-label="date"
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: "date" }));
    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it("respects weekStartsOn for the weekday header order", async () => {
    const user = userEvent.setup();
    render(
      <DatePicker
        defaultValue={new Date(2026, 6, 15)}
        weekStartsOn={1}
        aria-label="date"
      />,
    );
    await user.click(screen.getByRole("button", { name: "date" }));
    const headers = screen.getAllByRole("columnheader");
    expect(headers[0]).toHaveTextContent("Mo");
    expect(headers[6]).toHaveTextContent("Su");
  });
});
