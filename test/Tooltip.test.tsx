import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "../src/components/button/Button";
import { Tooltip } from "../src/components/tooltip/Tooltip";

describe("Tooltip", () => {
  it("wires the trigger to the tooltip via aria-describedby", () => {
    render(
      <Tooltip content="Saves your work">
        <Button>Save</Button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Save" });
    expect(trigger).toHaveAttribute("aria-describedby");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("reveals content on hover and hides on unhover", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Saves your work" openDelay={0}>
        <Button>Save</Button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Save" });

    await user.hover(trigger);
    const tip = await screen.findByRole("tooltip");
    expect(tip).toHaveTextContent("Saves your work");
    expect(trigger.getAttribute("aria-describedby")).toBe(tip.id);

    await user.unhover(trigger);
    await waitFor(() =>
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument(),
    );
  });

  it("reveals content on keyboard focus and hides on blur", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Saves your work" openDelay={0}>
        <Button>Save</Button>
      </Tooltip>,
    );

    await user.tab();
    expect(screen.getByRole("button", { name: "Save" })).toHaveFocus();
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();

    await user.tab();
    await waitFor(() =>
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument(),
    );
  });

  it("shows immediately when controlled open", () => {
    render(
      <Tooltip content="Always here" open>
        <Button>Save</Button>
      </Tooltip>,
    );
    expect(screen.getByRole("tooltip")).toHaveTextContent("Always here");
  });

  it("keeps the tooltip visible during the close delay", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Lingers" openDelay={0} closeDelay={150}>
        <Button>Save</Button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Save" });

    await user.hover(trigger);
    await screen.findByRole("tooltip");

    await user.unhover(trigger);
    // Still present immediately after leaving the trigger.
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument(),
    );
  });
});
