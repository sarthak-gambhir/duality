import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Select } from "../src/components/select/Select";
import { Combobox } from "../src/components/combobox/Combobox";
import { MultiSelect } from "../src/components/multi_select/MultiSelect";
import { DatePicker } from "../src/components/date_picker/DatePicker";
import { TimePicker } from "../src/components/time_picker/TimePicker";

const options = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
];

describe("Select controllable open-state", () => {
  it("renders open when defaultOpen is set", () => {
    render(<Select aria-label="fruit" options={options} defaultOpen />);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("honours a controlled open prop and reports changes", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Select
        aria-label="fruit"
        options={options}
        open={false}
        onOpenChange={onOpenChange}
      />,
    );
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    await user.click(screen.getByRole("combobox", { name: "fruit" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    // Stays closed because the parent owns the state.
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});

describe("Combobox controllable open-state", () => {
  it("renders open when defaultOpen is set", () => {
    render(<Combobox aria-label="fruit" options={options} defaultOpen />);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("reports open changes via onOpenChange", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Combobox
        aria-label="fruit"
        options={options}
        open={false}
        onOpenChange={onOpenChange}
      />,
    );
    await user.click(screen.getByRole("combobox", { name: "fruit" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});

describe("MultiSelect controllable open-state", () => {
  it("renders open when defaultOpen is set", () => {
    render(<MultiSelect aria-label="fruit" options={options} defaultOpen />);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("reports open changes via onOpenChange", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <MultiSelect
        aria-label="fruit"
        options={options}
        open={false}
        onOpenChange={onOpenChange}
      />,
    );
    await user.click(screen.getByRole("combobox", { name: "fruit" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});

describe("DatePicker controllable open-state", () => {
  it("renders open when defaultOpen is set", () => {
    render(<DatePicker aria-label="date" defaultOpen />);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("reports open changes via onOpenChange", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <DatePicker aria-label="date" open={false} onOpenChange={onOpenChange} />,
    );
    await user.click(screen.getByRole("button", { name: "date" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});

describe("TimePicker controllable open-state", () => {
  it("renders open when defaultOpen is set", () => {
    render(<TimePicker aria-label="time" defaultOpen />);
    expect(screen.getAllByRole("listbox").length).toBeGreaterThan(0);
  });

  it("reports open changes via onOpenChange", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <TimePicker aria-label="time" open={false} onOpenChange={onOpenChange} />,
    );
    await user.click(screen.getByRole("button", { name: "time" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});
