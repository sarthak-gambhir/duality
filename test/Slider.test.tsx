import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Slider } from "../src/components/slider/Slider";

describe("Slider", () => {
  it("exposes a slider role and updates its value", () => {
    render(<Slider aria-label="volume" min={0} max={100} defaultValue={40} />);
    const slider = screen.getByRole("slider", { name: "volume" });
    expect(slider).toHaveValue("40");
    fireEvent.change(slider, { target: { value: "75" } });
    expect(slider).toHaveValue("75");
  });

  it("sets aria-invalid when invalid", () => {
    render(<Slider aria-label="volume" invalid />);
    expect(screen.getByRole("slider", { name: "volume" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("calls onValueChange with the numeric value", () => {
    const onValueChange = vi.fn();
    render(
      <Slider
        aria-label="volume"
        defaultValue={40}
        onValueChange={onValueChange}
      />,
    );
    const slider = screen.getByRole("slider", { name: "volume" });
    fireEvent.change(slider, { target: { value: "60" } });
    expect(onValueChange).toHaveBeenLastCalledWith(60);
  });

  it("renders a value bubble when showValue is set", () => {
    render(
      <Slider
        aria-label="volume"
        defaultValue={40}
        showValue
        formatValue={(v) => `${v}%`}
      />,
    );
    expect(screen.getByText("40%")).toBeInTheDocument();
  });

  it("renders limit and mark labels", () => {
    render(
      <Slider
        aria-label="quality"
        defaultValue={50}
        minLabel="Low"
        maxLabel="High"
        marks={[{ value: 50, label: "Med" }]}
      />,
    );
    expect(screen.getByText("Low")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText("Med")).toBeInTheDocument();
  });
});
