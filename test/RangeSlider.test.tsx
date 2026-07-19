import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RangeSlider } from "../src/components/range_slider/RangeSlider";

describe("RangeSlider", () => {
  it("renders two sliders with the current values", () => {
    render(<RangeSlider defaultValue={[20, 80]} min={0} max={100} />);
    const [low, high] = screen.getAllByRole("slider");
    expect(low).toHaveAttribute("aria-valuenow", "20");
    expect(high).toHaveAttribute("aria-valuenow", "80");
  });

  it("moves the lower thumb with the keyboard without crossing the upper", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <RangeSlider
        defaultValue={[20, 80]}
        min={0}
        max={100}
        step={5}
        onValueChange={onValueChange}
      />,
    );
    const low = screen.getAllByRole("slider")[0] as HTMLElement;
    low.focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenLastCalledWith([25, 80]);
  });

  it("caps the lower thumb at the upper thumb", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <RangeSlider
        defaultValue={[70, 75]}
        min={0}
        max={100}
        step={5}
        onValueChange={onValueChange}
      />,
    );
    const low = screen.getAllByRole("slider")[0] as HTMLElement;
    low.focus();
    await user.keyboard("{End}");
    expect(onValueChange).toHaveBeenLastCalledWith([75, 75]);
  });

  it("disables both thumbs", () => {
    render(<RangeSlider defaultValue={[20, 80]} disabled />);
    for (const thumb of screen.getAllByRole("slider")) {
      expect(thumb).toHaveAttribute("aria-disabled", "true");
      expect(thumb).toHaveAttribute("tabindex", "-1");
    }
  });

  it("takes a large step with PageUp/PageDown", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <RangeSlider
        defaultValue={[20, 80]}
        min={0}
        max={100}
        step={1}
        largeStep={10}
        onValueChange={onValueChange}
      />,
    );
    const low = screen.getAllByRole("slider")[0] as HTMLElement;
    low.focus();
    await user.keyboard("{PageUp}");
    expect(onValueChange).toHaveBeenLastCalledWith([30, 80]);
    await user.keyboard("{PageDown}");
    expect(onValueChange).toHaveBeenLastCalledWith([20, 80]);
  });

  it("keeps a minimum gap between thumbs", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <RangeSlider
        defaultValue={[40, 60]}
        min={0}
        max={100}
        step={1}
        minStepsBetweenThumbs={10}
        onValueChange={onValueChange}
      />,
    );
    const low = screen.getAllByRole("slider")[0] as HTMLElement;
    low.focus();
    await user.keyboard("{End}");
    // Can't pass within 10 of the high thumb (60), so it caps at 50.
    expect(onValueChange).toHaveBeenLastCalledWith([50, 60]);
  });

  it("fires onValueCommit after a keyboard change", async () => {
    const onValueCommit = vi.fn();
    const user = userEvent.setup();
    render(
      <RangeSlider
        defaultValue={[20, 80]}
        min={0}
        max={100}
        step={5}
        onValueCommit={onValueCommit}
      />,
    );
    const low = screen.getAllByRole("slider")[0] as HTMLElement;
    low.focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueCommit).toHaveBeenLastCalledWith([25, 80]);
  });

  it("shows visible value labels", () => {
    render(<RangeSlider defaultValue={[20, 80]} showValues />);
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("80")).toBeInTheDocument();
  });

  it("renders tick marks with labels", () => {
    render(
      <RangeSlider
        defaultValue={[25, 75]}
        step={25}
        marks={[
          { value: 0, label: "min" },
          { value: 100, label: "max" },
        ]}
      />,
    );
    expect(screen.getByText("min")).toBeInTheDocument();
    expect(screen.getByText("max")).toBeInTheDocument();
  });
});
