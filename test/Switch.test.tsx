import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Switch } from "../src/components/switch/Switch";

describe("Switch", () => {
  it("exposes a switch role and toggles", async () => {
    const user = userEvent.setup();
    render(<Switch label="Wifi" />);
    const toggle = screen.getByRole("switch", { name: "Wifi" });
    expect(toggle).not.toBeChecked();
    await user.click(toggle);
    expect(toggle).toBeChecked();
  });

  it("can be disabled", () => {
    render(<Switch label="Wifi" disabled />);
    expect(screen.getByRole("switch", { name: "Wifi" })).toBeDisabled();
  });
});
