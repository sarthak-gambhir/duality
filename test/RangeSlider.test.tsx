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
});
