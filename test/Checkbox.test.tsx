import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Checkbox } from "../src/components/checkbox/Checkbox";

describe("Checkbox", () => {
  it("labels the control and toggles", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Accept" />);
    const box = screen.getByRole("checkbox", { name: "Accept" });
    expect(box).not.toBeChecked();
    await user.click(box);
    expect(box).toBeChecked();
  });

  it("reflects the indeterminate prop on the DOM node", () => {
    render(<Checkbox label="Mixed" indeterminate />);
    const box = screen.getByRole<HTMLInputElement>("checkbox", {
      name: "Mixed",
    });
    expect(box.indeterminate).toBe(true);
  });

  it("can be disabled", () => {
    render(<Checkbox label="Accept" disabled />);
    expect(screen.getByRole("checkbox", { name: "Accept" })).toBeDisabled();
  });
});
