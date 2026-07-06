import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Rating } from "../src/components/rating/Rating";

describe("Rating", () => {
  it("exposes a radiogroup of blocks and selects on click", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Rating
        defaultValue={2}
        max={5}
        label="Score"
        onValueChange={onValueChange}
      />,
    );

    expect(
      screen.getByRole("radiogroup", { name: "Score" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(5);

    await user.click(screen.getByRole("radio", { name: "4 of 5" }));
    expect(onValueChange).toHaveBeenLastCalledWith(4);
  });

  it("changes value with arrow keys", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Rating
        defaultValue={2}
        max={5}
        label="Score"
        onValueChange={onValueChange}
      />,
    );

    screen.getByRole("radio", { name: "2 of 5" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenLastCalledWith(3);
  });

  it("is non-interactive when read-only", () => {
    render(<Rating defaultValue={3} max={5} readOnly label="Score" />);
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toBeDisabled();
    }
  });
});
